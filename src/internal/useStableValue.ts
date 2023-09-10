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

        // TODO: double check dependencies
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return state;
}
