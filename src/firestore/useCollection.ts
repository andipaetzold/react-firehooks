import { DocumentData, FirestoreError, onSnapshot, Query, QuerySnapshot, SnapshotListenOptions } from "firebase/firestore";
import { useCallback } from "react";
import { ValueHookResult } from "../common/types";
import { useListen, UseListenOnChange } from "../internal/useListen";
import { isQueryEqual } from "./internal";

export type UseCollectionResult<Value extends DocumentData = DocumentData> = ValueHookResult<
    QuerySnapshot<Value>,
    FirestoreError
>;

/**
 * Options to configure the subscription
 */
export interface UseCollectionOptions {
    snapshotListenOptions?: SnapshotListenOptions;
}

/**
 * Returns and updates a QuerySnapshot of a Firestore Query
 *
 * @template Value Type of the collection data
 * @param {Query<Value> | undefined | null} query Firestore query that will be subscribed to
 * @param {?UseCollectionOptions} options Options to configure the subscription
 * @returns {UseCollectionResult<Value>} QuerySnapshot, loading, and error
 * * value: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useCollection<Value extends DocumentData = DocumentData>(
    query: Query<Value> | undefined | null,
    options?: UseCollectionOptions
): UseCollectionResult<Value> {
    const { snapshotListenOptions = {} } = options ?? {};

    const onChange: UseListenOnChange<QuerySnapshot<Value>, FirestoreError, Query<Value>> = useCallback(
        (stableQuery, next, error) =>
            onSnapshot<Value>(stableQuery, snapshotListenOptions, {
                next,
                error,
            }),
        []
    );

    return useListen(query ?? undefined, onChange, isQueryEqual);
}
