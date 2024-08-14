import { configure, renderHook, waitFor } from "@testing-library/react";
import { newPromise, newSymbol } from "../__testfixtures__/index.js";
import { useMultiGet } from "./useMultiGet.js";
import { it, expect, beforeEach, vi, afterEach, describe } from "vitest";

const result1 = newSymbol<string>("Result 1");
const result2 = newSymbol<string>("Result 2");

const refA1 = newSymbol("Ref A1");
const refA2 = newSymbol("Ref A2");

const refB1 = newSymbol("Ref B1");
const refB2 = newSymbol("Ref B2");

const isEqual = (a: unknown, b: unknown) =>
    [a, b].every((x) => [refA1, refA2].includes(x)) || [a, b].every((x) => [refB1, refB2].includes(x));

afterEach(() => {
    configure({ reactStrictMode: false });
});

describe.each([{ reactStrictMode: true }, { reactStrictMode: false }])(
    `strictMode=$reactStrictMode`,
    ({ reactStrictMode }) => {
        beforeEach(() => {
            configure({ reactStrictMode });
        });

        describe("initial state", () => {
            it("defined reference", () => {
                const getData = vi.fn().mockReturnValue(new Promise(() => {}));
                const { result } = renderHook(() => useMultiGet([refA1], getData, isEqual));
                expect(result.current).toStrictEqual([[undefined, true, undefined]]);
            });

            it("undefined reference", () => {
                const getData = vi.fn();
                const { result } = renderHook(() => useMultiGet([], getData, isEqual));
                expect(result.current).toStrictEqual([]);
            });

            it("when changing ref count", () => {});
        });
    },
);

describe("changing refs", () => {
    it("should not fetch twice for equal ref", async () => {
        const { promise, resolve } = newPromise<string>();
        const getData = vi.fn().mockReturnValue(promise);

        // first ref
        const { result, rerender } = renderHook(({ refs }) => useMultiGet(refs, getData, isEqual), {
            initialProps: { refs: [refA1] },
        });

        expect(getData).toHaveBeenCalledTimes(1);

        // resolve value
        resolve(result1);
        await waitFor(() => expect(result.current).toStrictEqual([[result1, false, undefined]]));

        // change ref
        rerender({ refs: [refA2] });
        expect(result.current).toStrictEqual([[result1, false, undefined]]);
        expect(getData).toHaveBeenCalledTimes(1);
    });

    it("should refetch for unequal ref", async () => {
        const { promise: promise1, resolve: resolve1 } = newPromise<string>();
        const { promise: promise2, resolve: resolve2 } = newPromise<string>();
        const getData = vi.fn().mockReturnValueOnce(promise1).mockReturnValue(promise2);

        // first ref
        const { result, rerender } = renderHook(({ refs }) => useMultiGet(refs, getData, isEqual), {
            initialProps: { refs: [refA1] },
        });
        expect(getData).toHaveBeenCalledTimes(1);

        // emit value
        resolve1(result1);
        await waitFor(() => expect(result.current).toStrictEqual([[result1, false, undefined]]));

        // change ref
        rerender({ refs: [refB1] });
        expect(result.current).toStrictEqual([[undefined, true, undefined]]);
        expect(getData).toHaveBeenCalledTimes(2);

        // emit value
        resolve2(result2);
        await waitFor(() => expect(result.current).toStrictEqual([[result2, false, undefined]]));
    });

    it("should ignore the first result of `getData` if the ref changes before it resolves", async () => {
        const { promise: promise1, resolve: resolve1 } = newPromise<string>();
        const { promise: promise2, resolve: resolve2 } = newPromise<string>();
        const getData = vi.fn().mockReturnValueOnce(promise1).mockReturnValueOnce(promise2);

        // first ref
        const { result, rerender } = renderHook(({ ref }) => useMultiGet([ref], getData, isEqual), {
            initialProps: { ref: refA1 },
        });
        await waitFor(() => expect(result.current).toStrictEqual([[undefined, true, undefined]]));

        // change ref
        rerender({ ref: refB1 });
        await waitFor(() => expect(result.current).toStrictEqual([[undefined, true, undefined]]));

        // first promise resolves
        resolve1(result1);

        // ensure that the first result is ignored
        await expect(
            waitFor(
                () => {
                    expect(result.current).toStrictEqual([[result1, false, undefined]]);
                },
                { timeout: 200 },
            ),
        ).rejects.toThrow();

        // second promise resolves
        resolve2(result2);
        await waitFor(() => expect(result.current).toStrictEqual([[result2, false, undefined]]));
    });
});

describe("changing size", () => {
    it("should adjust the returned states", async () => {
        const getData = vi.fn().mockReturnValue(new Promise(() => {}));

        // first ref
        const { result, rerender } = renderHook(({ refs }) => useMultiGet(refs, getData, isEqual), {
            initialProps: { refs: [refA1] },
        });
        await waitFor(() => expect(result.current).toStrictEqual([[undefined, true, undefined]]));

        // add ref
        rerender({ refs: [refA1, refB1] });
        await waitFor(() =>
            expect(result.current).toStrictEqual([
                [undefined, true, undefined],
                [undefined, true, undefined],
            ]),
        );

        // remove ref
        rerender({ refs: [refA1] });
        await waitFor(() => expect(result.current).toStrictEqual([[undefined, true, undefined]]));
    });

    it("increase", async () => {
        const { promise: promise1, resolve: resolve1 } = newPromise();
        const { promise: promise2, resolve: resolve2 } = newPromise();
        const getData = vi.fn().mockReturnValueOnce(promise1).mockReturnValueOnce(promise2);

        // first ref
        const { result, rerender } = renderHook(({ refs }) => useMultiGet(refs, getData, isEqual), {
            initialProps: { refs: [refA1] },
        });
        await waitFor(() => expect(result.current).toStrictEqual([[undefined, true, undefined]]));
        expect(getData).toHaveBeenCalledWith(refA1);
        expect(getData).toHaveBeenCalledTimes(1);

        // add ref
        rerender({ refs: [refA1, refB1] });
        await waitFor(() =>
            expect(result.current).toStrictEqual([
                [undefined, true, undefined],
                [undefined, true, undefined],
            ]),
        );
        expect(getData).toHaveBeenCalledWith(refB1);
        expect(getData).toHaveBeenCalledTimes(2);

        // first promise resolves
        resolve1(result1);
        await waitFor(() =>
            expect(result.current).toStrictEqual([
                [result1, false, undefined],
                [undefined, true, undefined],
            ]),
        );

        // second promise resolves
        resolve2(result2);
        await waitFor(() =>
            expect(result.current).toStrictEqual([
                [result1, false, undefined],
                [result2, false, undefined],
            ]),
        );
    });

    it("decrease", async () => {
        const { promise: promise1, resolve: resolve1 } = newPromise();
        const { promise: promise2, resolve: resolve2 } = newPromise();
        const getData = vi.fn().mockReturnValueOnce(promise1).mockReturnValueOnce(promise2);

        // first ref
        const { result, rerender } = renderHook(({ refs }) => useMultiGet(refs, getData, isEqual), {
            initialProps: { refs: [refA1, refB1] },
        });
        await waitFor(() =>
            expect(result.current).toStrictEqual([
                [undefined, true, undefined],
                [undefined, true, undefined],
            ]),
        );
        expect(getData).toHaveBeenCalledTimes(2);

        // second promise resolves
        resolve2(result2);
        await waitFor(() =>
            expect(result.current).toStrictEqual([
                [undefined, true, undefined],
                [result2, false, undefined],
            ]),
        );

        // remove ref
        rerender({ refs: [refA1] });
        await waitFor(() => expect(result.current).toStrictEqual([[undefined, true, undefined]]));
        expect(getData).toHaveBeenCalledTimes(2);

        // first promise resolves
        resolve1(result1);
        await waitFor(() => expect(result.current).toStrictEqual([[result1, false, undefined]]));
    });
});
