import { renderHook, waitFor } from "@testing-library/react";
import { newPromise, newSymbol } from "../__testfixtures__";
import { useOnce } from "./useOnce";
import { it, expect, beforeEach, describe, vi } from "vitest";

const result1 = newSymbol("Result 1");
const result2 = newSymbol("Result 2");
const error = newSymbol("Error");

const refA1 = newSymbol("Ref A1");
const refA2 = newSymbol("Ref A2");

const refB1 = newSymbol("Ref B1");
const refB2 = newSymbol("Ref B2");

const getData = vi.fn();
const isEqual = (a: any, b: any) =>
    [a, b].every((x) => [refA1, refA2].includes(x)) || [a, b].every((x) => [refB1, refB2].includes(x));

beforeEach(() => {
    vi.resetAllMocks();
});

describe("initial state", () => {
    it("defined reference", () => {
        getData.mockReturnValue(new Promise(() => {}));
        const { result } = renderHook(() => useOnce(refA1, getData, isEqual));
        expect(result.current).toStrictEqual([undefined, true, undefined]);
    });

    it("undefined reference", () => {
        const { result } = renderHook(() => useOnce(undefined, getData, isEqual));
        expect(result.current).toStrictEqual([undefined, false, undefined]);
    });
});

describe("initial load", () => {
    it("should return success result", async () => {
        const { promise, resolve } = newPromise<string>();
        getData.mockReturnValue(promise);

        const { result } = renderHook(() => useOnce(refA1, getData, isEqual));
        expect(result.current).toStrictEqual([undefined, true, undefined]);
        resolve(result1);
        await waitFor(() => expect(result.current).toStrictEqual([result1, false, undefined]));
    });

    it("should return error result", async () => {
        const { promise, reject } = newPromise<string>();
        getData.mockReturnValue(promise);

        const { result } = renderHook(() => useOnce(refA1, getData, isEqual));
        expect(result.current).toStrictEqual([undefined, true, undefined]);
        reject(error);
        await waitFor(() => expect(result.current).toStrictEqual([undefined, false, error]));
    });
});

describe("when ref changes", () => {
    describe("to equal ref", () => {
        it("should not update success result", async () => {
            getData.mockResolvedValueOnce(result1);

            const { result, rerender } = renderHook(({ ref }) => useOnce(ref, getData, isEqual), {
                initialProps: { ref: refA1 },
            });

            expect(result.current).toStrictEqual([undefined, true, undefined]);
            await waitFor(() => expect(result.current).toStrictEqual([result1, false, undefined]));
            expect(getData).toHaveBeenCalledTimes(1);

            rerender({ ref: refA2 });
            expect(result.current).toStrictEqual([result1, false, undefined]);
            expect(getData).toHaveBeenCalledTimes(1);
        });

        it("should not update error result", async () => {
            getData.mockRejectedValueOnce(error);

            const { result, rerender } = renderHook(({ ref }) => useOnce(ref, getData, isEqual), {
                initialProps: { ref: refA1 },
            });

            expect(result.current).toStrictEqual([undefined, true, undefined]);
            await waitFor(() => expect(result.current).toStrictEqual([undefined, false, error]));
            expect(getData).toHaveBeenCalledTimes(1);

            rerender({ ref: refA2 });
            expect(result.current).toStrictEqual([undefined, false, error]);
            expect(getData).toHaveBeenCalledTimes(1);
        });
    });

    describe("to unequal ref", () => {
        it("should update success result", async () => {
            getData.mockResolvedValueOnce(result1).mockResolvedValueOnce(result2);

            const { result, rerender } = renderHook(({ ref }) => useOnce(ref, getData, isEqual), {
                initialProps: { ref: refA1 },
            });

            expect(result.current).toStrictEqual([undefined, true, undefined]);
            expect(getData).toHaveBeenCalledTimes(1);
            await waitFor(() => expect(result.current).toStrictEqual([result1, false, undefined]));

            rerender({ ref: refB1 });
            expect(getData).toHaveBeenCalledTimes(2);
            await waitFor(() => expect(result.current).toStrictEqual([result2, false, undefined]));
        });

        it("should update error result", async () => {
            getData.mockRejectedValueOnce(error).mockResolvedValueOnce(result2);

            const { result, rerender } = renderHook(({ ref }) => useOnce(ref, getData, isEqual), {
                initialProps: { ref: refA1 },
            });

            expect(result.current).toStrictEqual([undefined, true, undefined]);
            expect(getData).toHaveBeenCalledTimes(1);
            await waitFor(() => expect(result.current).toStrictEqual([undefined, false, error]));

            rerender({ ref: refB1 });
            expect(result.current).toStrictEqual([undefined, true, undefined]);
            expect(getData).toHaveBeenCalledTimes(2);
            await waitFor(() => expect(result.current).toStrictEqual([result2, false, undefined]));
        });
    });
});
