import { DocumentData, FirestoreError, onSnapshot, Query, QuerySnapshot, SnapshotListenOptions } from "firebase/firestore";
import { useCallback } from "react";
import { ValueHookResult } from "../common/types.js";
import { useMultiListen, UseMultiListenChange } from "../internal/useMultiListen.js";
import { isQueryEqual } from "./internal.js";

export type UseQueriesResult<AppModelTypes extends ReadonlyArray<unknown> = ReadonlyArray<DocumentData>> = {
    [Index in keyof AppModelTypes]: ValueHookResult<QuerySnapshot<AppModelTypes[Index]>, FirestoreError>;
} & { length: AppModelTypes["length"] };

/**
 * Options to configure the subscription
 */
export interface UseQueriesOptions {
    snapshotListenOptions?: SnapshotListenOptions;
}

/**
 * Returns and updates a QuerySnapshot of multiple Firestore queries
 * @template AppModelTypes Tuple of shapes of the data after it was converted from firestore
 * @template DbModelTypes Tuple of shapes of the data in firestore
 * @param queries Firestore queries that will be subscribed to
 * @param options Options to configure the subscription
 * @returns Array with tuple for each query:
 * - value: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
 * - loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * - error: `undefined` if no error occurred
 */
export function useQueries<
    AppModelTypes extends ReadonlyArray<unknown> = ReadonlyArray<DocumentData>,
    DbModelTypes extends ReadonlyArray<DocumentData> = ReadonlyArray<DocumentData>,
>(
    queries: { [Index in keyof AppModelTypes]: Query<AppModelTypes[Index], DbModelTypes[number]> },
    options?: UseQueriesOptions,
): UseQueriesResult<AppModelTypes> {
    const { snapshotListenOptions } = options ?? {};
    const { includeMetadataChanges } = snapshotListenOptions ?? {};

    const onChange: UseMultiListenChange<
        QuerySnapshot<AppModelTypes[number], DbModelTypes[number]>,
        FirestoreError,
        Query<AppModelTypes[number], DbModelTypes[number]>
    > = useCallback(
        (query, next, error) =>
            onSnapshot(
                query,
                { includeMetadataChanges },
                {
                    next,
                    error,
                },
            ),
        [includeMetadataChanges],
    );

    // @ts-expect-error `useMultiListen` assumes a single value type
    return useMultiListen(queries, onChange, isQueryEqual);
}
