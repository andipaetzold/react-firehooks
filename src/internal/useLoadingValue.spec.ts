import { act, renderHook } from "@testing-library/react";
import { newSymbol } from "../__testfixtures__";
import { LoadingState, useLoadingValue } from "./useLoadingValue";
import { it, expect, describe } from "vitest";

const value = newSymbol("Value");
const error = newSymbol("Error");

describe("initial state", () => {
    it("without default value", () => {
        const { result } = renderHook(() => useLoadingValue(LoadingState));

        expect(result.current.value).toBeUndefined();
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeUndefined();
    });

    it("with default value", () => {
        const { result } = renderHook(() => useLoadingValue(value));

        expect(result.current.value).toBe(value);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeUndefined();
    });

    it("with default value undefined", () => {
        const { result } = renderHook(() => useLoadingValue(undefined));

        expect(result.current.value).toBe(undefined);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeUndefined();
    });
});

describe("setValue", () => {
    it("with undefined value", () => {
        const { result } = renderHook(() => useLoadingValue<symbol>(value));
        act(() => result.current.setValue(undefined));

        expect(result.current.value).toBeUndefined();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeUndefined();
    });

    it("with a value", () => {
        const { result } = renderHook(() => useLoadingValue<symbol>(LoadingState));
        act(() => result.current.setValue(value));

        expect(result.current.value).toBe(value);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeUndefined();
    });

    it("with error", () => {
        const { result } = renderHook(() => useLoadingValue<symbol>(LoadingState));
        act(() => result.current.setError(error));

        act(() => result.current.setValue(value));

        expect(result.current.value).toBe(value);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeUndefined();
    });
});

describe("setError", () => {
    it("without value", () => {
        const { result } = renderHook(() => useLoadingValue<symbol>(LoadingState));
        act(() => result.current.setError(error));

        expect(result.current.value).toBeUndefined();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(error);
    });

    it("with value", () => {
        const { result } = renderHook(() => useLoadingValue<symbol>(value));
        act(() => result.current.setError(error));

        expect(result.current.value).toBeUndefined();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(error);
    });
});

describe("setLoading", () => {
    it("with value", () => {
        const { result } = renderHook(() => useLoadingValue<symbol>(value));
        act(() => result.current.setLoading());

        expect(result.current.value).toBeUndefined();
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeUndefined();
    });

    it("with error", () => {
        const { result } = renderHook(() => useLoadingValue<symbol>(value));
        act(() => result.current.setError(error));

        act(() => result.current.setLoading());

        expect(result.current.value).toBeUndefined();
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeUndefined();
    });
});
