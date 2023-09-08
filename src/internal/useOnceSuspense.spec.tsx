import { cleanup, render, renderHook } from "@testing-library/react";
import React, { Suspense } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { newSymbol } from "../__testfixtures__";
import { useOnceSuspense } from "./useOnceSuspense";

const result1 = newSymbol("Result 1");
const result2 = newSymbol("Result 2");
const error = new Error("Something went wrong");

const refA1 = newSymbol("Ref A1");
const refA2 = newSymbol("Ref A2");

const refB1 = newSymbol("Ref B1");
const refB2 = newSymbol("Ref B2");

const getData = vi.fn();
const isEqual = (a: any, b: any) =>
    [a, b].every((x) => [refA1, refA2].includes(x)) || [a, b].every((x) => [refB1, refB2].includes(x));

vi.useFakeTimers();

beforeEach(() => {
    vi.resetAllMocks();

    globalThis._firehookWrappedPromises?.clear();
});

afterEach(cleanup);

describe("success state", () => {
    it("defined reference", async () => {
        getData.mockResolvedValue(result1);
        const { result } = renderHook(() => useOnceSuspense(refA1, getData, isEqual));
        await vi.runOnlyPendingTimersAsync();
        await vi.runOnlyPendingTimersAsync(); // Not sure why this is needed
        expect(result.current).toBe(result1);
    });

    it("undefined reference", async () => {
        const { result } = renderHook(() => useOnceSuspense(undefined, getData, isEqual));
        await vi.runOnlyPendingTimersAsync();
        await vi.runOnlyPendingTimersAsync(); // Not sure why this is needed
        expect(result.current).toBeUndefined();
    });
});

it("throws error", () => {
    const getData = () => {
        throw error;
    };
    expect(() => {
        renderHook(() => useOnceSuspense(refA1, getData, isEqual));
    }).toThrow(error);
});

it("within `<Suspense>`", async () => {
    getData.mockResolvedValue("Success");
    const Component = () => {
        const data = useOnceSuspense<string, any>(refA1, getData, isEqual);
        return <div data-testid="component">{data}</div>;
    };

    const { getByTestId } = render(
        <Suspense fallback="fallback">
            <Component />
        </Suspense>,
    );

    await vi.runOnlyPendingTimersAsync();
    await vi.runOnlyPendingTimersAsync(); // Not sure why this is needed

    expect(getByTestId("component")).toBeDefined();
    expect(getByTestId("component").textContent).toBe("Success");
});

describe("when ref changes", () => {
    it("to equal ref", async () => {
        getData.mockResolvedValue(result1);

        const { result, rerender } = renderHook(({ ref }) => useOnceSuspense(ref, getData, isEqual), {
            initialProps: { ref: refA1 },
        });

        await vi.runOnlyPendingTimersAsync();
        await vi.runOnlyPendingTimersAsync(); // Not sure why this is needed

        expect(result.current).toStrictEqual(result1);
        expect(getData).toHaveBeenCalledTimes(1);

        rerender({ ref: refA2 });

        await vi.runOnlyPendingTimersAsync();
        await vi.runOnlyPendingTimersAsync(); // Not sure why this is needed

        expect(result.current).toStrictEqual(result1);
        expect(getData).toHaveBeenCalledTimes(1);
    });

    it("to unequal ref", async () => {
        getData.mockResolvedValueOnce(result1).mockResolvedValueOnce(result2);

        const { result, rerender } = renderHook(({ ref }) => useOnceSuspense(ref, getData, isEqual), {
            initialProps: { ref: refA1 },
        });

        await vi.runOnlyPendingTimersAsync();
        await vi.runOnlyPendingTimersAsync(); // Not sure why this is needed

        expect(result.current).toStrictEqual(result1);
        expect(getData).toHaveBeenCalledTimes(1);

        rerender({ ref: refB1 });

        await vi.runOnlyPendingTimersAsync();
        await vi.runOnlyPendingTimersAsync(); // Not sure why this is needed

        expect(result.current).toStrictEqual(result2);
        expect(getData).toHaveBeenCalledTimes(2);
    });
});
