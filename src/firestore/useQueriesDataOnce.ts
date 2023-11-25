import { DocumentData, FirestoreError, Query, SnapshotOptions } from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types.js";
import { useMultiGet } from "../internal/useMultiGet.js";
import { getDocsFromSource, isQueryEqual } from "./internal.js";
import type { Source } from "./types.js";

export type UseQueriesDataOnceResult<AppModelTypes extends ReadonlyArray<unknown> = ReadonlyArray<DocumentData>> = {
    [Index in keyof AppModelTypes]: ValueHookResult<AppModelTypes[Index], FirestoreError>;
} & { length: AppModelTypes["length"] };

/**
 * Options to configure the subscription
 */
export interface UseQueriesDataOnceOptions {
    source?: Source | undefined;
    snapshotOptions?: SnapshotOptions | undefined;
}

/**
 * Returns the data of multiple Firestore queries. Does not update the data once initially fetched
 * @template AppModelTypes Tuple of shapes of the data after it was converted from firestore
 * @template DbModelTypes Tuple of shapes of the data in firestore
 * @param queries Firestore queries that will be fetched
 * @param options Options to configure how the queries are fetched
 * @returns Array with tuple for each query:
 * - value: Query data; `undefined` if query is currently being fetched, or an error occurred
 * - loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * - error: `undefined` if no error occurred
 */
export function useQueriesDataOnce<
    AppModelTypes extends ReadonlyArray<unknown> = ReadonlyArray<DocumentData>,
    DbModelTypes extends ReadonlyArray<DocumentData> = ReadonlyArray<DocumentData>,
>(
    queries: { [Index in keyof AppModelTypes]: Query<AppModelTypes[Index], DbModelTypes[number]> },
    options?: UseQueriesDataOnceOptions | undefined,
): UseQueriesDataOnceResult<AppModelTypes> {
    const { source = "default", snapshotOptions } = options ?? {};
    const { serverTimestamps = "none" } = snapshotOptions ?? {};

    const getData = useCallback(
        async (stableQuery: Query<AppModelTypes[number], DbModelTypes[number]>) => {
            const snap = await getDocsFromSource(stableQuery, source);
            return snap.docs.map((doc) => doc.data({ serverTimestamps }));
        },
        [source, serverTimestamps],
    );

    // @ts-expect-error `useMultiGet` assumes a single value type
    return useMultiGet(queries, getData, isQueryEqual);
}
