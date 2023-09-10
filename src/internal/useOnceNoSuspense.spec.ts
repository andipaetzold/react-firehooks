import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { newPromise, newSymbol } from "../__testfixtures__";
import { useOnceNoSuspense } from "./useOnceNoSuspense";

function createMockData() {
    const result1 = newSymbol("Result 1");
    const result2 = newSymbol("Result 2");
    const error = newSymbol("Error");

    const refA1 = newSymbol("Ref A1");
    const refA2 = newSymbol("Ref A2");

    const refB1 = newSymbol("Ref B1");
    const refB2 = newSymbol("Ref B2");

    const getData = vi.fn();
    const isEqual = (a: unknown, b: unknown) =>
        [a, b].every((x) => [refA1, refA2].includes(x)) || [a, b].every((x) => [refB1, refB2].includes(x));

    return {
        result1,
        result2,
        error,
        refA1,
        refA2,
        refB1,
        refB2,
        isEqual,
        getData,
    };
}

describe("initial state", () => {
    it("defined reference", () => {
        const { refA1, getData } = createMockData();
        getData.mockReturnValue(new Promise(() => {}));
        const { result } = renderHook(() => useOnceNoSuspense(refA1, getData));
        expect(result.current).toStrictEqual([undefined, true, undefined]);
    });

    it("undefined reference", () => {
        const { getData } = createMockData();
        const { result } = renderHook(() => useOnceNoSuspense(undefined, getData));
        expect(result.current).toStrictEqual([undefined, false, undefined]);
    });
});

describe("initial load", () => {
    it("should return success result", async () => {
        const { result1, refA1, getData } = createMockData();
        const { promise, resolve } = newPromise();
        getData.mockReturnValue(promise);

        const { result } = renderHook(() => useOnceNoSuspense(refA1, getData));
        expect(result.current).toStrictEqual([undefined, true, undefined]);
        resolve(result1);
        await waitFor(() => expect(result.current).toStrictEqual([result1, false, undefined]));
    });

    it("should return error result", async () => {
        const { error, refA1, getData } = createMockData();
        const { promise, reject } = newPromise<string>();
        getData.mockReturnValue(promise);

        const { result } = renderHook(() => useOnceNoSuspense(refA1, getData));
        expect(result.current).toStrictEqual([undefined, true, undefined]);
        reject(error);
        await waitFor(() => expect(result.current).toStrictEqual([undefined, false, error]));
    });
});

describe("when ref changes", () => {
    it("should update success result", async () => {
        const { result1, result2, refA1, refB1, getData } = createMockData();
        getData.mockResolvedValueOnce(result1).mockResolvedValueOnce(result2);

        const { result, rerender } = renderHook(({ ref }) => useOnceNoSuspense(ref, getData), {
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
        const { result2, error, refA1, refB1, getData } = createMockData();
        getData.mockRejectedValueOnce(error).mockResolvedValueOnce(result2);

        const { result, rerender } = renderHook(({ ref }) => useOnceNoSuspense(ref, getData), {
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
