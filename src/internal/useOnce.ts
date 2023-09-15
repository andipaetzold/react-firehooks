import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common/index.js";
import { useIsMounted } from "./useIsMounted.js";
import { LoadingState, useLoadingValue } from "./useLoadingValue.js";
import { useStableValue } from "./useStableValue.js";

/**
 * @internal
 */
export function useOnce<Value, Error, Reference>(
    reference: Reference | undefined,
    getData: (ref: Reference) => Promise<Value>,
    isEqual: (a: Reference | undefined, b: Reference | undefined) => boolean,
): ValueHookResult<Value, Error> {
    const isMounted = useIsMounted();
    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<Value, Error>(
        reference === undefined ? undefined : LoadingState,
    );

    const stableRef = useStableValue(reference ?? undefined, isEqual);

    useEffect(() => {
        (async () => {
            if (stableRef === undefined) {
                setValue();
            } else {
                setLoading();

                try {
                    const data = await getData(stableRef);

                    if (!isMounted.current) {
                        return;
                    }

                    setValue(data);
                } catch (e) {
                    if (!isMounted.current) {
                        return;
                    }

                    // We assume this is always a Error
                    setError(e as Error);
                }
            }
        })();
    }, [stableRef, getData, isEqual, setValue, setLoading, isMounted, setError]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
