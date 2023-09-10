/* eslint-disable jsdoc/require-jsdoc */
import { render, renderHook, waitFor } from "@testing-library/react";
import React, { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newSymbol } from "../__testfixtures__";
import { useOnceSuspense } from "./useOnceSuspense";

function createMockData() {
    const result1 = newSymbol("Result 1");
    const result2 = newSymbol("Result 2");
    const error = new Error("Something went wrong");

    const refA1 = newSymbol("Ref A1");
    const refA2 = newSymbol("Ref A2");

    const refB1 = newSymbol("Ref B1");
    const refB2 = newSymbol("Ref B2");

    const isEqual = (a: unknown, b: unknown) =>
        [a, b].every((x) => [refA1, refA2].includes(x)) || [a, b].every((x) => [refB1, refB2].includes(x));

    const getData = vi.fn();

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

beforeEach(() => {
    globalThis._firehookWrappedPromises?.clear();
});

describe("success state", () => {
    it("defined reference", async () => {
        const { result1, refA1, isEqual, getData } = createMockData();

        getData.mockResolvedValue(result1);
        const { result } = renderHook(() => useOnceSuspense(refA1, getData, isEqual));

        await waitFor(() => expect(result.current).toStrictEqual([result1, false, undefined]));
    });

    it("undefined reference", async () => {
        const { isEqual, getData } = createMockData();
        const { result } = renderHook(() => useOnceSuspense(undefined, getData, isEqual));

        await waitFor(() => expect(result.current).toStrictEqual([undefined, false, undefined]));
    });
});

it("throws error", () => {
    const { error, refA1, isEqual } = createMockData();

    const getData = () => {
        throw error;
    };
    expect(() => {
        renderHook(() => useOnceSuspense(refA1, getData, isEqual));
    }).toThrow(error);
});

it("within `<Suspense>`", async () => {
    const { refA1, isEqual, getData } = createMockData();

    getData.mockResolvedValue("Success");
    const Component = () => {
        const [data] = useOnceSuspense<string, Error, unknown>(refA1, getData, isEqual)!;
        return <div data-testid="component">{data}</div>;
    };

    const { getByTestId } = render(
        <Suspense fallback="fallback">
            <Component />
        </Suspense>,
    );

    await waitFor(() => expect(getByTestId("component")).toBeDefined());
    expect(getByTestId("component").textContent).toBe("Success");
});

it("when ref changes", async () => {
    const { result1, result2, refA1, refB1, isEqual, getData } = createMockData();
    getData.mockResolvedValueOnce(result1).mockResolvedValueOnce(result2);

    const { result, rerender } = renderHook(({ ref }) => useOnceSuspense(ref, getData, isEqual), {
        initialProps: { ref: refA1 },
    });

    await waitFor(() => expect(result.current).toStrictEqual([result1, false, undefined]));
    expect(getData).toHaveBeenCalledTimes(1);

    rerender({ ref: refB1 });

    await waitFor(() => expect(result.current).toStrictEqual([result2, false, undefined]));
    expect(getData).toHaveBeenCalledTimes(2);
});
