import { configure, renderHook, waitFor } from "@testing-library/react";
import { newPromise, newSymbol } from "../__testfixtures__/index.js";
import { useGet } from "./useGet.js";
import { it, expect, beforeEach, describe, vi, afterEach } from "vitest";

const result1 = newSymbol<string>("Result 1");
const result2 = newSymbol<string>("Result 2");
const error1 = newSymbol("Error 1");
const error2 = newSymbol("Error 2");

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
                const { result } = renderHook(() => useGet(refA1, getData, isEqual));
                expect(result.current).toStrictEqual([undefined, true, undefined]);
            });

            it("undefined reference", () => {
                const getData = vi.fn();
                const { result } = renderHook(() => useGet(undefined, getData, isEqual));
                expect(result.current).toStrictEqual([undefined, false, undefined]);
            });
        });
    },
);

describe("initial load", () => {
    it("should return success result", async () => {
        const { promise, resolve } = newPromise<string>();
        const getData = vi.fn().mockReturnValue(promise);

        const { result } = renderHook(() => useGet(refA1, getData, isEqual));

        // initial state
        expect(result.current).toStrictEqual([undefined, true, undefined]);

        // resolve promise
        resolve(result1);
        await waitFor(() => expect(result.current).toStrictEqual([result1, false, undefined]));
    });

    it("should return error result", async () => {
        const { promise, reject } = newPromise<string>();
        const getData = vi.fn().mockReturnValue(promise);

        const { result } = renderHook(() => useGet(refA1, getData, isEqual));

        // initial state
        expect(result.current).toStrictEqual([undefined, true, undefined]);

        // reject promise
        reject(error1);
        await waitFor(() => expect(result.current).toStrictEqual([undefined, false, error1]));
    });
});

describe("when ref changes", () => {
    describe("to equal ref", () => {
        it("should not update success result", async () => {
            const getData = vi.fn().mockResolvedValueOnce(result1);

            const { result, rerender } = renderHook(({ ref }) => useGet(ref, getData, isEqual), {
                initialProps: { ref: refA1 },
            });

            // initial state
            expect(result.current).toStrictEqual([undefined, true, undefined]);
            await waitFor(() => expect(result.current).toStrictEqual([result1, false, undefined]));
            expect(getData).toHaveBeenCalledTimes(1);

            // change ref
            rerender({ ref: refA2 });
            expect(result.current).toStrictEqual([result1, false, undefined]);
            expect(getData).toHaveBeenCalledTimes(1);
        });

        it("should not update error result", async () => {
            const getData = vi.fn().mockRejectedValueOnce(error1);

            const { result, rerender } = renderHook(({ ref }) => useGet(ref, getData, isEqual), {
                initialProps: { ref: refA1 },
            });

            // initial state
            expect(result.current).toStrictEqual([undefined, true, undefined]);
            await waitFor(() => expect(result.current).toStrictEqual([undefined, false, error1]));
            expect(getData).toHaveBeenCalledTimes(1);

            // change ref
            rerender({ ref: refA2 });
            expect(result.current).toStrictEqual([undefined, false, error1]);
            expect(getData).toHaveBeenCalledTimes(1);
        });
    });

    describe("to unequal ref", () => {
        it("should update success result", async () => {
            const getData = vi.fn().mockResolvedValueOnce(result1).mockResolvedValueOnce(result2);

            const { result, rerender } = renderHook(({ ref }) => useGet(ref, getData, isEqual), {
                initialProps: { ref: refA1 },
            });

            // initial state
            expect(result.current).toStrictEqual([undefined, true, undefined]);
            expect(getData).toHaveBeenCalledTimes(1);
            await waitFor(() => expect(result.current).toStrictEqual([result1, false, undefined]));

            // change ref
            rerender({ ref: refB1 });
            expect(getData).toHaveBeenCalledTimes(2);
            await waitFor(() => expect(result.current).toStrictEqual([result2, false, undefined]));
        });

        it("should update error result", async () => {
            const getData = vi.fn().mockRejectedValueOnce(error1).mockResolvedValueOnce(result2);

            const { result, rerender } = renderHook(({ ref }) => useGet(ref, getData, isEqual), {
                initialProps: { ref: refA1 },
            });

            // initial state
            expect(result.current).toStrictEqual([undefined, true, undefined]);
            expect(getData).toHaveBeenCalledTimes(1);
            await waitFor(() => expect(result.current).toStrictEqual([undefined, false, error1]));

            // change ref
            rerender({ ref: refB1 });
            expect(result.current).toStrictEqual([undefined, true, undefined]);
            expect(getData).toHaveBeenCalledTimes(2);
            await waitFor(() => expect(result.current).toStrictEqual([result2, false, undefined]));
        });

        describe("if changed before first `getData` is settled", () => {
            it("should ignore the first result", async () => {
                const { promise: promise1, resolve: resolve1 } = newPromise<string>();
                const { promise: promise2, resolve: resolve2 } = newPromise<string>();
                const getData = vi.fn().mockReturnValueOnce(promise1).mockReturnValueOnce(promise2);

                const { result, rerender } = renderHook(({ ref }) => useGet(ref, getData, isEqual), {
                    initialProps: { ref: refA1 },
                });

                // initial state
                await waitFor(() => expect(result.current).toStrictEqual([undefined, true, undefined]));

                // change ref
                rerender({ ref: refB1 });
                await waitFor(() => expect(result.current).toStrictEqual([undefined, true, undefined]));

                // first promise resolves
                resolve1(result1);

                // ensure that the first result is ignored
                await expect(
                    waitFor(
                        () => {
                            expect(result.current).toStrictEqual([result1, false, undefined]);
                        },
                        { timeout: 200 },
                    ),
                ).rejects.toThrow();

                // second promise resolves
                resolve2(result2);
                await waitFor(() => expect(result.current).toStrictEqual([result2, false, undefined]));
            });

            it("should ignore the first thrown error", async () => {
                const { promise: promise1, reject: reject1 } = newPromise<string>();
                const { promise: promise2, reject: reject2 } = newPromise<string>();
                const getData = vi.fn().mockReturnValueOnce(promise1).mockReturnValueOnce(promise2);

                const { result, rerender } = renderHook(({ ref }) => useGet(ref, getData, isEqual), {
                    initialProps: { ref: refA1 },
                });

                // initial state
                await waitFor(() => expect(result.current).toStrictEqual([undefined, true, undefined]));

                // change ref
                rerender({ ref: refB1 });
                await waitFor(() => expect(result.current).toStrictEqual([undefined, true, undefined]));

                // first promise rejects
                reject1(error1);

                // ensure that the first result is ignored
                await expect(
                    waitFor(
                        () => {
                            expect(result.current).toStrictEqual([undefined, false, error1]);
                        },
                        { timeout: 200 },
                    ),
                ).rejects.toThrow();

                // second promise rejects
                reject2(error2);
                await waitFor(() => expect(result.current).toStrictEqual([undefined, false, error2]));
            });
        });
    });
});

it("refetches if `getData` changes", async () => {
    const getData1 = vi.fn().mockResolvedValue(result1);
    const getData2 = vi.fn().mockResolvedValue(result2);

    const { result, rerender } = renderHook(({ getData }) => useGet(refA1, getData, isEqual), {
        initialProps: { getData: getData1 },
    });

    // initial state
    await waitFor(() => {
        expect(result.current).toStrictEqual([result1, false, undefined]);
    });
    expect(getData1).toHaveBeenCalledTimes(1);

    // changing `getData`
    rerender({ getData: getData2 });
    await waitFor(() => {
        expect(result.current).toStrictEqual([result2, false, undefined]);
    });
    expect(getData2).toHaveBeenCalledTimes(1);
});
