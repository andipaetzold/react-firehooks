import { DocumentData, FirestoreError, onSnapshot, Query, SnapshotListenOptions, SnapshotOptions } from "firebase/firestore";
import { useCallback } from "react";
import { ValueHookResult } from "../common/types.js";
import { useMultiListen, UseMultiListenChange } from "../internal/useMultiListen.js";
import { isQueryEqual } from "./internal.js";

export type UseQueriesDataResult<AppModelTypes extends ReadonlyArray<unknown> = ReadonlyArray<DocumentData>> = {
    [Index in keyof AppModelTypes]: ValueHookResult<AppModelTypes[Index], FirestoreError>;
} & { length: AppModelTypes["length"] };

/**
 * Options to configure the subscription
 */
export interface UseQueriesDataOptions {
    snapshotListenOptions?: SnapshotListenOptions | undefined;
    snapshotOptions?: SnapshotOptions | undefined;
}

/**
 * Returns and updates a the document data of multiple Firestore queries
 * @template AppModelTypes Tuple of shapes of the data after it was converted from firestore
 * @template DbModelTypes Tuple of shapes of the data in firestore
 * @param queries Firestore queries that will be subscribed to
 * @param options Options to configure the subscription
 * @returns Array with tuple for each query:
 * - value: Query data; `undefined` if query is currently being fetched, or an error occurred
 * - loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * - error: `undefined` if no error occurred
 */
export function useQueriesData<
    AppModelTypes extends ReadonlyArray<unknown> = ReadonlyArray<DocumentData>,
    DbModelTypes extends ReadonlyArray<DocumentData> = ReadonlyArray<DocumentData>,
>(
    queries: { [Index in keyof AppModelTypes]: Query<AppModelTypes[Index], DbModelTypes[number]> },
    options?: UseQueriesDataOptions | undefined,
): UseQueriesDataResult<AppModelTypes> {
    const { snapshotListenOptions, snapshotOptions } = options ?? {};
    const { includeMetadataChanges = false } = snapshotListenOptions ?? {};
    const { serverTimestamps = "none" } = snapshotOptions ?? {};

    const onChange: UseMultiListenChange<
        AppModelTypes[number],
        FirestoreError,
        Query<AppModelTypes[number], DbModelTypes[number]>
    > = useCallback(
        (query, next, error) =>
            onSnapshot(
                query,
                { includeMetadataChanges },
                {
                    next: (snap) => next(snap.docs.map((doc) => doc.data({ serverTimestamps }))),
                    error,
                },
            ),
        [includeMetadataChanges, serverTimestamps],
    );

    // @ts-expect-error `useMultiListen` assumes a single value type
    return useMultiListen(queries, onChange, isQueryEqual);
}
