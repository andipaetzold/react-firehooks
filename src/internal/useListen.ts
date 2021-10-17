import { useEffect, useMemo, useRef } from "react";
import { ValueHookResult } from "../common";
import { useLoadingValue } from "./useLoadingValue";
import { useStableValue } from "./useStableValue";

/**
 * @internal
 */
export type UseListenOnChange<Value, Error, Reference> = (
    ref: Reference,
    onValue: (value: Value | undefined) => void,
    onError: (e: Error) => void
) => () => void;

/**
 * @internal
 */
export function useListen<Value, Error, Reference>(
    reference: Reference | undefined,
    onChange: UseListenOnChange<Value, Error, Reference>,
    isEqual: (a: Reference | undefined, b: Reference | undefined) => boolean,
    defaultValue?: Value
): ValueHookResult<Value, Error> {
    const { error, loading, setLoading, setError, setValue, value } = useLoadingValue<Value, Error>(defaultValue);

    const stableRef = useStableValue(reference ?? undefined, isEqual);
    const firstRender = useRef<boolean>(true);

    useEffect(() => {
        if (stableRef === undefined) {
            setValue();
        } else {
            // do not set loading state on first render
            // otherwise, the defaultValue gets overwritten
            if (firstRender.current) {
                firstRender.current = false;
            } else {
                setLoading();
            }

            const unsubscribe = onChange(stableRef, setValue, setError);
            return () => unsubscribe();
        }
    }, [stableRef]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
