import { DocumentData, FirestoreError, Query, QuerySnapshot } from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types.js";
import { useOnce } from "../internal/useOnce.js";
import { getDocsFromSource, isQueryEqual } from "./internal.js";
import type { Source } from "./types.js";

export type UseCollectionOnceResult<Value extends DocumentData = DocumentData> = ValueHookResult<
    QuerySnapshot<Value>,
    FirestoreError
>;

/**
 * Options to configure how the query is fetched
 */
export interface UseCollectionOnceOptions {
    source?: Source;
}

/**
 * Returns the QuerySnapshot of a Firestore Query. Does not update the QuerySnapshot once initially fetched
 *
 * @template Value Type of the collection data
 * @param {Query<Value> | undefined | null} query Firestore query that will be fetched
 * @param {?UseCollectionOnceOptions} options Options to configure how the query is fetched
 * @returns {UseCollectionOnceResult<Value>} QuerySnapshot, loading state, and error
 * * value: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useCollectionOnce<Value extends DocumentData = DocumentData>(
    query: Query<Value> | undefined | null,
    options?: UseCollectionOnceOptions
): UseCollectionOnceResult<Value> {
    const { source = "default" } = options ?? {};

    const getData = useCallback(async (stableQuery: Query<Value>) => getDocsFromSource(stableQuery, source), []);
    return useOnce(query ?? undefined, getData, isQueryEqual);
}
