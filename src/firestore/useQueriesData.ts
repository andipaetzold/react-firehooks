import { DocumentData, FirestoreError, onSnapshot, Query, SnapshotListenOptions, SnapshotOptions } from "firebase/firestore";
import { useCallback } from "react";
import { ValueHookResult } from "../common/types.js";
import { useMultiListen, UseMultiListenChange } from "../internal/useMultiListen.js";
import { isQueryEqual } from "./internal.js";

export type UseQueriesDataResult<Values extends ReadonlyArray<DocumentData> = ReadonlyArray<DocumentData>> = {
    [Index in keyof Values]: ValueHookResult<Values[Index], FirestoreError>;
} & { length: Values["length"] };

/**
 * Options to configure the subscription
 */
export interface UseQueriesDataOptions {
    snapshotListenOptions?: SnapshotListenOptions;
    snapshotOptions?: SnapshotOptions;
}

/**
 * Returns and updates a the document data of multiple Firestore queries
 * @template Values Tuple of types of the collection data
 * @param queries Firestore queries that will be subscribed to
 * @param options Options to configure the subscription
 * @returns Array with tuple for each query:
 * value: Query data; `undefined` if query is currently being fetched, or an error occurred
 * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useQueriesData<Values extends ReadonlyArray<DocumentData> = ReadonlyArray<DocumentData>>(
    queries: { [Index in keyof Values]: Query<Values[Index]> },
    options?: UseQueriesDataOptions,
): UseQueriesDataResult<Values> {
    const { snapshotListenOptions, snapshotOptions } = options ?? {};
    const { includeMetadataChanges } = snapshotListenOptions ?? {};
    const { serverTimestamps } = snapshotOptions ?? {};

    const onChange: UseMultiListenChange<Values[number], FirestoreError, Query<Values[number]>> = useCallback(
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
