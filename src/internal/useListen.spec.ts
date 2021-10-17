import { act, renderHook } from "@testing-library/react-hooks";
import { newSymbol } from "../__testfixtures__";
import { useListen } from "./useListen";

const result1 = newSymbol("Result 1");
const result2 = newSymbol("Result 2");
const error = newSymbol("Error");

const refA1 = newSymbol("Ref A1");
const refA2 = newSymbol("Ref A2");

const refB1 = newSymbol("Ref B1");
const refB2 = newSymbol("Ref B2");

const onChangeUnsubscribe = jest.fn();
const onChange = jest.fn();

const isEqual = (a: any, b: any) =>
    [a, b].every((x) => [refA1, refA2].includes(x)) || [a, b].every((x) => [refB1, refB2].includes(x));

beforeEach(() => {
    jest.resetAllMocks();
    onChange.mockReturnValue(onChangeUnsubscribe);
});

describe("initial state", () => {
    it("with undefined reference", () => {
        const { result } = renderHook(() => useListen(undefined, onChange, isEqual));

        expect(onChange).toHaveBeenCalledTimes(0);
        expect(result.current).toStrictEqual([undefined, false, undefined]);
    });

    it("with defined reference", () => {
        const { result } = renderHook(() => useListen(refA1, onChange, isEqual));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(refA1, expect.any(Function), expect.any(Function));

        expect(result.current).toStrictEqual([undefined, true, undefined]);
    });

    it("with default value", () => {
        const { result } = renderHook(() => useListen(refA1, onChange, isEqual, result1));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(refA1, expect.any(Function), expect.any(Function));

        expect(result.current).toStrictEqual([result1, false, undefined]);
    });
});

describe("when changing ref", () => {
    it("should not resubscribe for equal ref", () => {
        const { rerender } = renderHook(({ ref }) => useListen(ref, onChange, isEqual), {
            initialProps: { ref: refA1 },
        });

        expect(onChange).toHaveBeenCalledTimes(1);

        rerender({ ref: refA2 });

        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("should resubscribe for different ref", () => {
        const { rerender } = renderHook(({ ref }) => useListen(ref, onChange, isEqual), {
            initialProps: { ref: refA1 },
        });

        expect(onChangeUnsubscribe).toHaveBeenCalledTimes(0);
        expect(onChange).toHaveBeenCalledTimes(1);

        rerender({ ref: refB1 });

        expect(onChange).toHaveBeenCalledTimes(2);
        expect(onChangeUnsubscribe).toHaveBeenCalledTimes(1);
    });
});

it("should return emitted values", () => {
    const { result } = renderHook(() => useListen(refA1, onChange, isEqual));
    const setValue = onChange.mock.calls[0][1];

    expect(result.current).toStrictEqual([undefined, true, undefined]);

    act(() => {
        setValue(result1);
    });
    expect(result.current).toStrictEqual([result1, false, undefined]);

    act(() => {
        setValue(result2);
    });
    expect(result.current).toStrictEqual([result2, false, undefined]);
});

it("should return emitted error", () => {
    const { result } = renderHook(() => useListen(refA1, onChange, isEqual));
    const setValue = onChange.mock.calls[0][1];
    const setError = onChange.mock.calls[0][2];

    expect(result.current).toStrictEqual([undefined, true, undefined]);

    act(() => {
        setError(error);
    });
    expect(result.current).toStrictEqual([undefined, false, error]);

    act(() => {
        setValue(result2);
    });
    expect(result.current).toStrictEqual([result2, false, undefined]);
});
