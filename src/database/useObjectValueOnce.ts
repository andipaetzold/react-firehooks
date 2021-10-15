import { get, Query } from "firebase/database";
import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common";
import { useIsMounted } from "../util/useIsMounted";
import { useLoadingValue } from "../util/useLoadingValue";
import { useStableQuery } from "./internal";

export type UseObjectValueOnceResult<Value = unknown> = ValueHookResult<Value, Error>;

/**
 * Returns the DataSnapshot of the Realtime Database query. Does not update the DataSnapshot once initially fetched
 *
 * @template {Value} Type of the object value
 * @param {Query | undefined | null} query Realtime Database query
 * @returns {UseObjectValueOnceResult} User, loading state, and error
 * * value: Object value; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
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
