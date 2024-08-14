import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common/index.js";
import { useLoadingValue, LoadingState } from "./useLoadingValue.js";
import { useStableValue } from "./useStableValue.js";
import { usePrevious } from "./usePrevious.js";

/**
 * @internal
 */
export type UseListenOnChange<Value, Error, Reference> = (
    ref: Reference,
    onValue: (value: Value | undefined) => void,
    onError: (e: Error) => void,
) => () => void;

/**
 * @internal
 */
export function useListen<Value, Error, Reference>(
    reference: Reference | undefined,
    onChange: UseListenOnChange<Value, Error, Reference>,
    isEqual: (a: Reference | undefined, b: Reference | undefined) => boolean,
    initialState: Value | typeof LoadingState,
): ValueHookResult<Value, Error> {
    const { error, loading, setLoading, setError, setValue, value } = useLoadingValue<Value, Error>(
        reference === undefined ? undefined : initialState,
    );

    const stableRef = useStableValue(reference ?? undefined, isEqual);
    const previousRef = usePrevious(stableRef);

    // set state when ref changes
    useEffect(() => {
        if (stableRef === previousRef) {
            return;
        }

        if (stableRef === undefined) {
            setValue();
        } else {
            setLoading();
        }
    }, [previousRef, setLoading, setValue, stableRef]);

    // subscribe to changes
    useEffect(() => {
        if (stableRef === undefined) {
            return;
        }
        const unsubscribe = onChange(stableRef, setValue, setError);
        return () => unsubscribe();
    }, [onChange, setError, setValue, stableRef]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
