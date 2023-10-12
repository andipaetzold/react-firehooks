import { DocumentData, FirestoreError, Query, QuerySnapshot } from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types.js";
import { useGet } from "../internal/useGet.js";
import { getDocsFromSource, isQueryEqual } from "./internal.js";
import type { Source } from "./types.js";

export type UseQueryOnceResult<AppModelType = DocumentData> = ValueHookResult<QuerySnapshot<AppModelType>, FirestoreError>;

/**
 * Options to configure how the query is fetched
 */
export interface UseQueryOnceOptions {
    source?: Source;
}

/**
 * Returns the QuerySnapshot of a Firestore query. Does not update the QuerySnapshot once initially fetched
 * @template AppModelType Shape of the data after it was converted from firestore
 * @template DbModelType Shape of the data in firestore
 * @param query Firestore query that will be fetched
 * @param options Options to configure how the query is fetched
 * @returns QuerySnapshot, loading state, and error
 * - value: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
 * - loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * - error: `undefined` if no error occurred
 */
export function useQueryOnce<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>(
    query: Query<AppModelType, DbModelType> | undefined | null,
    options?: UseQueryOnceOptions,
): UseQueryOnceResult<AppModelType> {
    const { source = "default" } = options ?? {};

    const getData = useCallback(
        async (stableQuery: Query<AppModelType, DbModelType>) => getDocsFromSource(stableQuery, source),
        [source],
    );

    return useGet(query ?? undefined, getData, isQueryEqual);
}
