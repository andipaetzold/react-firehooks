import { DocumentData, FirestoreError, onSnapshot, Query, QuerySnapshot, SnapshotListenOptions } from "firebase/firestore";
import { useCallback } from "react";
import { ValueHookResult } from "../common/types.js";
import { useMultiListen, UseMultiListenChange } from "../internal/useMultiListen.js";
import { isQueryEqual } from "./internal.js";

export type UseQueriesResult<Values extends ReadonlyArray<DocumentData> = ReadonlyArray<DocumentData>> = {
    [Index in keyof Values]: ValueHookResult<QuerySnapshot<Values[Index]>, FirestoreError>;
} & { length: Values["length"] };

/**
 * Options to configure the subscription
 */
export interface UseQueriesOptions {
    snapshotListenOptions?: SnapshotListenOptions;
}

/**
 * Returns and updates a QuerySnapshot of multiple Firestore queries
 *
 * @template Values Tuple of types of the collection data
 * @param {Query[]} queries Firestore queries that will be subscribed to
 * @param {?UseQueriesOptions} options Options to configure the subscription
 * @returns {ValueHookResult[]} Array with tuple for each query:
 * * value: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useQueries<Values extends ReadonlyArray<DocumentData> = ReadonlyArray<DocumentData>>(
    queries: { [Index in keyof Values]: Query<Values[Index]> },
    options?: UseQueriesOptions,
): UseQueriesResult<Values> {
    const { snapshotListenOptions = {} } = options ?? {};
    const onChange: UseMultiListenChange<QuerySnapshot<Values[number]>, FirestoreError, Query<Values[number]>> = useCallback(
        (query, next, error) =>
            onSnapshot(query, snapshotListenOptions, {
                next,
                error,
            }),
        [],
    );

    // @ts-expect-error `useMultiListen` assumes a single value type
    return useMultiListen(queries, onChange, isQueryEqual);
}
