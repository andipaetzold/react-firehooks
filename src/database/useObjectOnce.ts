import { DataSnapshot, get, Query } from "firebase/database";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/index.js";
import { useOnce } from "../internal/useOnce.js";
import { isQueryEqual } from "./internal.js";

export type UseObjectOnceResult = ValueHookResult<DataSnapshot, Error>;

/**
 * Returns and updates the DataSnapshot of the Realtime Database query. Does not update the DataSnapshot once initially fetched
 *
 * @param {Query | undefined | null} query Realtime Database query
 * @returns {UseObjectOnceResult} User, loading state, and error
 * * value: DataSnapshot; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useObjectOnce(query: Query | undefined | null): UseObjectOnceResult {
    const getData = useCallback((stableQuery: Query) => get(stableQuery), []);
    return useOnce(query ?? undefined, getData, isQueryEqual);
}
