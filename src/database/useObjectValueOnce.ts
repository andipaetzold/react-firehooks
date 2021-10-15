import { get, Query } from "firebase/database";
import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common";
import { useIsMounted } from "../util/useIsMounted";
import { useLoadingValue } from "../util/useLoadingValue";
import { useStableQuery } from "./internal";

export type UseObjectValueOnceResult<Value = unknown> = ValueHookResult<Value, Error>;

export function useObjectValueOnce<Value = unknown>(query: Query | undefined | null): UseObjectValueOnceResult<Value> {
    const isMounted = useIsMounted();
    const { error, loading, setLoading, setError, setValue, value } = useLoadingValue<Value, Error>();

    const stableQuery = useStableQuery(query ?? undefined);

    useEffect(() => {
        (async () => {
            if (stableQuery === undefined) {
                setValue();
            } else {
                setLoading();

                try {
                    const snap = await get(stableQuery);
                    if (!isMounted.current) {
                        return;
                    }

                    setValue(snap.val());
                } catch (e) {
                    if (!isMounted.current) {
                        return;
                    }

                    setError(e as Error);
                }
            }
        })();
    }, [stableQuery]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
