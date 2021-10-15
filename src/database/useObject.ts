import { DataSnapshot, onValue, Query } from "firebase/database";
import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common";
import { useLoadingValue } from "../util/useLoadingValue";
import { useStableQuery } from "./internal";

export type UseObjectResult = ValueHookResult<DataSnapshot, Error>;

/**
 * Returns the DataSnapshot of the Realtime Database query
 *
 * @param {Query | undefined | null} query Realtime Database query
 * @returns {UseObjectResult} User, loading state, and error
 * * value: DataSnapshot; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useObject(query: Query | undefined | null): UseObjectResult {
    const { error, loading, setLoading, setError, setValue, value } = useLoadingValue<DataSnapshot, Error>();

    const stableQuery = useStableQuery(query ?? undefined);

    useEffect(() => {
        if (stableQuery === undefined) {
            setValue();
        } else {
            setLoading();

            const unsubscribe = onValue(stableQuery, setValue, setError);
            return () => unsubscribe();
        }
    }, [stableQuery]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
