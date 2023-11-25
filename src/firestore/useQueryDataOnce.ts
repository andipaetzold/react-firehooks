import { DocumentData, FirestoreError, Query, SnapshotOptions } from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types.js";
import { useGet } from "../internal/useGet.js";
import { getDocsFromSource, isQueryEqual } from "./internal.js";
import type { Source } from "./types.js";

export type UseQueryDataOnceResult<AppModelType = DocumentData> = ValueHookResult<AppModelType[], FirestoreError>;

/**
 * Options to configure the subscription
 */
export interface UseQueryDataOnceOptions {
    source?: Source | undefined;
    snapshotOptions?: SnapshotOptions | undefined;
}

/**
 * Returns the data of a Firestore Query. Does not update the data once initially fetched
 * @template AppModelType Shape of the data after it was converted from firestore
 * @template DbModelType Shape of the data in firestore
 * @param query Firestore query that will be fetched
 * @param options Options to configure how the query is fetched
 * @returns Query data, loading state, and error
 * - value: Query data; `undefined` if query is currently being fetched, or an error occurred
 * - loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * - error: `undefined` if no error occurred
 */
export function useQueryDataOnce<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>(
    query: Query<AppModelType, DbModelType> | undefined | null,
    options?: UseQueryDataOnceOptions | undefined,
): UseQueryDataOnceResult<AppModelType> {
    const { source = "default", snapshotOptions } = options ?? {};
    const { serverTimestamps = "none" } = snapshotOptions ?? {};

    const getData = useCallback(
        async (stableQuery: Query<AppModelType, DbModelType>) => {
            const snap = await getDocsFromSource(stableQuery, source);
            return snap.docs.map((doc) => doc.data({ serverTimestamps }));
        },
        [serverTimestamps, source],
    );

    return useGet(query ?? undefined, getData, isQueryEqual);
}
