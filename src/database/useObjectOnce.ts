import { DataSnapshot, get, Query } from "firebase/database";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/index.js";
import { useOnce } from "../internal/useOnce.js";
import { isQueryEqual } from "./internal.js";

export type UseObjectOnceResult = ValueHookResult<DataSnapshot, Error>;

/**
 * Options to configure how the object is fetched
 */
export interface UseObjectOnceOptions {
    /**
     * @default false
     */
    suspense?: boolean;
}

/**
 * Returns and updates the DataSnapshot of the Realtime Database query. Does not update the DataSnapshot once initially fetched
 * @param query Realtime Database query
 * @param [options] Options to configure how the object is fetched
 * @returns User, loading state, and error
 * value: DataSnapshot; `undefined` if query is currently being fetched, or an error occurred
 * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useObjectOnce(query: Query | undefined | null, options?: UseObjectOnceOptions): UseObjectOnceResult {
    const { suspense = false } = options ?? {};
    const getData = useCallback((stableQuery: Query) => get(stableQuery), []);
    return useOnce(query ?? undefined, getData, isQueryEqual, suspense);
}
