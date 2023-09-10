import { DocumentData, FirestoreError, Query, QuerySnapshot } from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types.js";
import { useOnce } from "../internal/useOnce.js";
import { getDocsFromSource, isQueryEqual } from "./internal.js";
import type { Source } from "./types.js";

export type UseQueryOnceResult<Value extends DocumentData = DocumentData> = ValueHookResult<
    QuerySnapshot<Value>,
    FirestoreError
>;

/**
 * Options to configure how the query is fetched
 */
export interface UseQueryOnceOptions {
    /**
     * @default "default"
     */
    source?: Source;

    /**
     * @default false
     */
    suspense?: boolean;
}

/**
 * Returns the QuerySnapshot of a Firestore Query. Does not update the QuerySnapshot once initially fetched
 *
 * @template Value Type of the collection data
 * @param {Query<Value> | undefined | null} query Firestore query that will be fetched
 * @param {?UseQueryOnceOptions} options Options to configure how the query is fetched
 * @returns {UseQueryOnceResult<Value>} QuerySnapshot, loading state, and error
 * * value: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred; Always `false` with `supsense=true`
 * * error: `undefined` if no error occurred; Always `undefined` with `supsense=true`
 */
export function useQueryOnce<Value extends DocumentData = DocumentData>(
    query: Query<Value> | undefined | null,
    options?: UseQueryOnceOptions,
): UseQueryOnceResult<Value> {
    const { source = "default", suspense = false } = options ?? {};

    const getData = useCallback(async (stableQuery: Query<Value>) => getDocsFromSource(stableQuery, source), []);
    return useOnce(query ?? undefined, getData, isQueryEqual, suspense);
}
