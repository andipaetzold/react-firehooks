import { DocumentData, FirestoreError, Query, QuerySnapshot } from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types.js";
import { useGet } from "../internal/useGet.js";
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
    source?: Source;
}

/**
 * Returns the QuerySnapshot of a Firestore query. Does not update the QuerySnapshot once initially fetched
 * @template Value Type of the collection data
 * @param query Firestore query that will be fetched
 * @param options Options to configure how the query is fetched
 * @returns QuerySnapshot, loading state, and error
 * value: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
 * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useQueryOnce<Value extends DocumentData = DocumentData>(
    query: Query<Value> | undefined | null,
    options?: UseQueryOnceOptions,
): UseQueryOnceResult<Value> {
    const { source = "default" } = options ?? {};

    const getData = useCallback(
        async (stableQuery: Query<Value>) => getDocsFromSource(stableQuery, source),

        // TODO: add options as dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
    return useGet(query ?? undefined, getData, isQueryEqual);
}
