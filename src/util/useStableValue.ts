import { useEffect, useState as useRef } from "react";

/**
 * @internal
 */
export function useStableValue<Value>(value: Value, isEqual: (a: Value, b: Value) => boolean): Value {
    const [state, setState] = useRef(value);

    useEffect(() => {
        if (!isEqual(state, value)) {
            setState(value);
        }
    }, [value]);

    return state;
}
