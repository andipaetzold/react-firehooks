import { act, renderHook } from "@testing-library/react";
import { newSymbol } from "../__testfixtures__";
import { useMultiListen } from "./useMultiListen";
import { it, expect, beforeEach, describe, vi } from "vitest";

const result1 = newSymbol("Result 1");
const result2 = newSymbol("Result 2");
const result3 = newSymbol("Result 3");
const result4 = newSymbol("Result 4");
const error1 = newSymbol("Error 1");
const error2 = newSymbol("Error 2");

const refA1 = newSymbol("Ref A1");
const refA2 = newSymbol("Ref A2");

const refB1 = newSymbol("Ref B1");
const refB2 = newSymbol("Ref B2");

const onChangeUnsubscribe = vi.fn();
const onChange = vi.fn();

const isEqual = (a: any, b: any) =>
    [a, b].every((x) => [refA1, refA2].includes(x)) || [a, b].every((x) => [refB1, refB2].includes(x));

beforeEach(() => {
    vi.resetAllMocks();
    onChange.mockReturnValue(onChangeUnsubscribe);
});

it("initial state", () => {
    const { result } = renderHook(() => useMultiListen([refA1, refB1], onChange, isEqual));
    expect(result.current).toStrictEqual([
        [undefined, true, undefined],
        [undefined, true, undefined],
    ]);
});

describe("when changing refs", () => {
    it("should not resubscribe for equal ref", async () => {
        // first ref
        const { result, rerender } = renderHook(({ refs }) => useMultiListen(refs, onChange, isEqual), {
            initialProps: { refs: [refA1] },
        });

        expect(onChangeUnsubscribe).toHaveBeenCalledTimes(0);
        expect(onChange).toHaveBeenCalledTimes(1);

        // emit value
        act(() => onChange.mock.calls[0][1](result1));
        expect(result.current).toStrictEqual([[result1, false, undefined]]);

        // change ref
        rerender({ refs: [refA2] });
        expect(result.current).toStrictEqual([[result1, false, undefined]]);
        expect(onChangeUnsubscribe).toHaveBeenCalledTimes(0);
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("should resubscribe for different ref", () => {
        // first ref
        const { result, rerender } = renderHook(({ refs }) => useMultiListen(refs, onChange, isEqual), {
            initialProps: { refs: [refA1] },
        });
        expect(onChangeUnsubscribe).toHaveBeenCalledTimes(0);
        expect(onChange).toHaveBeenCalledTimes(1);

        // emit value
        act(() => onChange.mock.calls[0][1](result1));
        expect(result.current).toStrictEqual([[result1, false, undefined]]);

        // change ref
        rerender({ refs: [refB1] });
        expect(result.current).toStrictEqual([[undefined, true, undefined]]);
        expect(onChange).toHaveBeenCalledTimes(2);
        expect(onChangeUnsubscribe).toHaveBeenCalledTimes(1);

        // emit value
        act(() => onChange.mock.calls[1][1](result2));
        expect(result.current).toStrictEqual([[result2, false, undefined]]);
    });
});

describe("changing size", () => {
    it("increase", () => {
        const { result, rerender } = renderHook(({ refs }) => useMultiListen(refs, onChange, isEqual), {
            initialProps: { refs: [refA1] },
        });

        const setValue1 = onChange.mock.calls[0][1];
        act(() => setValue1(result1));
        expect(result.current).toStrictEqual([[result1, false, undefined]]);

        rerender({ refs: [refA1, refB1] });
        expect(result.current).toStrictEqual([
            [result1, false, undefined],
            [undefined, true, undefined],
        ]);

        const setValue2 = onChange.mock.calls[1][1];
        act(() => setValue2(result2));
        expect(result.current).toStrictEqual([
            [result1, false, undefined],
            [result2, false, undefined],
        ]);
    });

    it("decreate", () => {
        const { result, rerender } = renderHook(({ refs }) => useMultiListen(refs, onChange, isEqual), {
            initialProps: { refs: [refA1, refB1] },
        });

        const setValue1 = onChange.mock.calls[0][1];
        const setValue2 = onChange.mock.calls[1][1];
        act(() => setValue1(result1));
        act(() => setValue2(result2));
        expect(result.current).toStrictEqual([
            [result1, false, undefined],
            [result2, false, undefined],
        ]);

        rerender({ refs: [refA1] });
        expect(result.current).toStrictEqual([[result1, false, undefined]]);

        act(() => setValue1(result3));
        expect(result.current).toStrictEqual([[result3, false, undefined]]);
    });
});

it("should return emitted values", () => {
    const { result } = renderHook(() => useMultiListen([refA1, refB1], onChange, isEqual));
    const setValue1 = onChange.mock.calls[0][1];
    const setValue2 = onChange.mock.calls[1][1];

    expect(result.current).toStrictEqual([
        [undefined, true, undefined],
        [undefined, true, undefined],
    ]);

    act(() => setValue1(result1));
    expect(result.current).toStrictEqual([
        [result1, false, undefined],
        [undefined, true, undefined],
    ]);

    act(() => setValue2(result3));
    expect(result.current).toStrictEqual([
        [result1, false, undefined],
        [result3, false, undefined],
    ]);

    act(() => setValue1(result2));
    expect(result.current).toStrictEqual([
        [result2, false, undefined],
        [result3, false, undefined],
    ]);

    act(() => setValue2(result4));
    expect(result.current).toStrictEqual([
        [result2, false, undefined],
        [result4, false, undefined],
    ]);
});

it("should return emitted error", () => {
    const { result } = renderHook(() => useMultiListen([refA1, refB1], onChange, isEqual));
    const setError1 = onChange.mock.calls[0][2];
    const setError2 = onChange.mock.calls[1][2];

    expect(result.current).toStrictEqual([
        [undefined, true, undefined],
        [undefined, true, undefined],
    ]);

    act(() => setError1(error1));
    expect(result.current).toStrictEqual([
        [undefined, false, error1],
        [undefined, true, undefined],
    ]);

    act(() => setError2(error2));
    expect(result.current).toStrictEqual([
        [undefined, false, error1],
        [undefined, false, error2],
    ]);
});
