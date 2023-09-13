/* eslint-disable jsdoc/require-jsdoc */
import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common/index.js";
import { useIsMounted } from "./useIsMounted.js";
import { LoadingState, useLoadingValue } from "./useLoadingValue.js";

export function useOnceNoSuspense<Value, Error, Reference>(
    stableRef: Reference | undefined,
    getData: (ref: Reference) => Promise<Value>,
    enabled = true,
): ValueHookResult<Value, Error> | undefined {
    const isMounted = useIsMounted();
    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<Value, Error>(
        stableRef === undefined ? undefined : LoadingState,
    );
    useEffect(() => {
        if (!enabled) {
            return;
        }

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

        // TODO: double-check dependencies
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, stableRef]);

    const result = useMemo<ValueHookResult<Value, Error>>(() => [value, loading, error], [value, loading, error]);
    return enabled ? result : undefined;
}
