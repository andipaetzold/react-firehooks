import { renderHook } from "@testing-library/react";
import { newSymbol } from "../__testfixtures__";
import { useStableValue } from "./useStableValue";

const value1 = newSymbol("Value 1");
const value2 = newSymbol("Value 2");

it("should return same value if values are equal", () => {
    const alwaysTrue = () => true;

    const { result, rerender } = renderHook(({ value }) => useStableValue(value, alwaysTrue), {
        initialProps: { value: value1 },
    });

    expect(result.current).toBe(value1);
    rerender({ value: value2 });
    expect(result.current).toBe(value1);
});

it("should return same value if values are not equal", () => {
    const alwaysFalse = () => false;

    const { result, rerender } = renderHook(({ value }) => useStableValue(value, alwaysFalse), {
        initialProps: { value: value1 },
    });

    expect(result.current).toBe(value1);
    rerender({ value: value2 });
    expect(result.current).toBe(value2);
});
