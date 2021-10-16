import { onValue, Query } from "firebase/database";
import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common";
import { useLoadingValue } from "../internal/useLoadingValue";
import { useStableQuery } from "./internal";

export type UseObjectValueResult<Value = unknown> = ValueHookResult<Value, Error>;

/**
 * Returns and updates the DataSnapshot of the Realtime Database query
 *
 * @template {Value} Type of the object value
 * @param {Query | undefined | null} query Realtime Database query
 * @returns {UseObjectValueResult} User, loading state, and error
 * * value: Object value; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useObjectValue<Value = unknown>(query: Query | undefined | null): UseObjectValueResult<Value> {
    const { error, loading, setLoading, setError, setValue, value } = useLoadingValue<Value, Error>();

    const stableQuery = useStableQuery(query ?? undefined);

    useEffect(() => {
        if (stableQuery === undefined) {
            setValue();
        } else {
            setLoading();

            const unsubscribe = onValue(stableQuery, (snap) => setValue(snap.val()), setError);
            return () => unsubscribe();
        }
    }, [stableQuery]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
