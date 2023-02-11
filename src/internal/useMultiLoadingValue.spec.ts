import { act, renderHook } from "@testing-library/react";
import { newSymbol } from "../__testfixtures__";
import { useMultiLoadingValue } from "./useMultiLoadingValue";
import { it, expect, describe } from "vitest";

const value1 = newSymbol("Value 1");
const value2 = newSymbol("Value 2");
const error1 = newSymbol("Error 1");
const error2 = newSymbol("Error 2");

it("initial state", () => {
    const { result } = renderHook(() => useMultiLoadingValue(1));

    expect(result.current.states).toHaveLength(1);
    expect(result.current.states[0].value).toBeUndefined();
    expect(result.current.states[0].loading).toBe(true);
    expect(result.current.states[0].error).toBeUndefined();
});

describe("size change", () => {
    it("increase", () => {
        const { result, rerender } = renderHook(({ size }) => useMultiLoadingValue(size), {
            initialProps: { size: 1 },
        });

        expect(result.current.states).toHaveLength(1);

        rerender({ size: 2 });

        expect(result.current.states).toHaveLength(2);
        expect(result.current.states[0].value).toBeUndefined();
        expect(result.current.states[0].loading).toBe(true);
        expect(result.current.states[0].error).toBeUndefined();
        expect(result.current.states[1].value).toBeUndefined();
        expect(result.current.states[1].loading).toBe(true);
        expect(result.current.states[1].error).toBeUndefined();
    });

    it("decrease", () => {
        const { result, rerender } = renderHook(({ size }) => useMultiLoadingValue(size), {
            initialProps: { size: 2 },
        });

        expect(result.current.states).toHaveLength(2);

        rerender({ size: 1 });

        expect(result.current.states).toHaveLength(1);
        expect(result.current.states[0].value).toBeUndefined();
        expect(result.current.states[0].loading).toBe(true);
        expect(result.current.states[0].error).toBeUndefined();
    });
});

describe("setValue", () => {
    it("with undefined value", () => {
        const { result } = renderHook(() => useMultiLoadingValue<Symbol>(1));
        act(() => result.current.setValue(0, undefined));

        expect(result.current.states[0].value).toBeUndefined();
        expect(result.current.states[0].loading).toBe(false);
        expect(result.current.states[0].error).toBeUndefined();
    });

    it("with a value", () => {
        const { result } = renderHook(() => useMultiLoadingValue<Symbol>(1));
        act(() => result.current.setValue(0, value1));

        expect(result.current.states[0].value).toBe(value1);
        expect(result.current.states[0].loading).toBe(false);
        expect(result.current.states[0].error).toBeUndefined();
    });

    it("multiple values", () => {
        const { result } = renderHook(() => useMultiLoadingValue<Symbol>(2));
        act(() => result.current.setValue(0, value1));
        act(() => result.current.setValue(1, value2));

        expect(result.current.states[0].value).toBe(value1);
        expect(result.current.states[0].loading).toBe(false);
        expect(result.current.states[0].error).toBeUndefined();

        expect(result.current.states[1].value).toBe(value2);
        expect(result.current.states[1].loading).toBe(false);
        expect(result.current.states[1].error).toBeUndefined();
    });

    it("with error", () => {
        const { result } = renderHook(() => useMultiLoadingValue<Symbol>(1));
        act(() => result.current.setError(0, error1));
        act(() => result.current.setValue(0, value1));

        expect(result.current.states[0].value).toBe(value1);
        expect(result.current.states[0].loading).toBe(false);
        expect(result.current.states[0].error).toBeUndefined();
    });
});

describe("setError", () => {
    it("without value", () => {
        const { result } = renderHook(() => useMultiLoadingValue<Symbol>(1));
        act(() => result.current.setError(0, error1));

        expect(result.current.states[0].value).toBeUndefined();
        expect(result.current.states[0].loading).toBe(false);
        expect(result.current.states[0].error).toBe(error1);
    });

    it("with value", () => {
        const { result } = renderHook(() => useMultiLoadingValue<Symbol>(1));
        act(() => result.current.setValue(0, value1));
        act(() => result.current.setError(0, error1));

        expect(result.current.states[0].value).toBeUndefined();
        expect(result.current.states[0].loading).toBe(false);
        expect(result.current.states[0].error).toBe(error1);
    });

    it("multiple queries", () => {
        const { result } = renderHook(() => useMultiLoadingValue<Symbol>(2));
        act(() => result.current.setError(0, error1));
        act(() => result.current.setError(1, error2));

        expect(result.current.states[0].value).toBeUndefined();
        expect(result.current.states[0].loading).toBe(false);
        expect(result.current.states[0].error).toBe(error1);

        expect(result.current.states[1].value).toBeUndefined();
        expect(result.current.states[1].loading).toBe(false);
        expect(result.current.states[1].error).toBe(error2);
    });
});

describe("setLoading", () => {
    it("with value", () => {
        const { result } = renderHook(() => useMultiLoadingValue<Symbol>(1));
        act(() => result.current.setValue(0, value1));
        act(() => result.current.setLoading(0));

        expect(result.current.states[0].value).toBeUndefined();
        expect(result.current.states[0].loading).toBe(true);
        expect(result.current.states[0].error).toBeUndefined();
    });

    it("with error", () => {
        const { result } = renderHook(() => useMultiLoadingValue<Symbol>(1));
        act(() => result.current.setError(0, error1));
        act(() => result.current.setLoading(0));

        expect(result.current.states[0].value).toBeUndefined();
        expect(result.current.states[0].loading).toBe(true);
        expect(result.current.states[0].error).toBeUndefined();
    });
});

describe("combinations", () => {
    it("setError & setValue & setLoading", () => {
        const { result } = renderHook(() => useMultiLoadingValue<Symbol>(3));
        act(() => result.current.setError(0, error1));
        act(() => result.current.setValue(1, value2));
        act(() => result.current.setLoading(2));

        expect(result.current.states[0].value).toBeUndefined();
        expect(result.current.states[0].loading).toBe(false);
        expect(result.current.states[0].error).toBe(error1);

        expect(result.current.states[1].value).toBe(value2);
        expect(result.current.states[1].loading).toBe(false);
        expect(result.current.states[1].error).toBeUndefined();

        expect(result.current.states[2].value).toBeUndefined;
        expect(result.current.states[2].loading).toBe(true);
        expect(result.current.states[2].error).toBeUndefined();
    });
});
