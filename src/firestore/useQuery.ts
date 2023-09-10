import { DocumentData, FirestoreError, onSnapshot, Query, QuerySnapshot, SnapshotListenOptions } from "firebase/firestore";
import { useCallback } from "react";
import { ValueHookResult } from "../common/types.js";
import { useListen, UseListenOnChange } from "../internal/useListen.js";
import { LoadingState } from "../internal/useLoadingValue.js";
import { isQueryEqual } from "./internal.js";

export type UseQueryResult<Value extends DocumentData = DocumentData> = ValueHookResult<
    QuerySnapshot<Value>,
    FirestoreError
>;

/**
 * Options to configure the subscription
 */
export interface UseQueryOptions {
    snapshotListenOptions?: SnapshotListenOptions;
}

/**
 * Returns and updates a QuerySnapshot of a Firestore Query
 * @template Value Type of the collection data
 * @param query Firestore query that will be subscribed to
 * @param options Options to configure the subscription
 * @returns QuerySnapshot, loading, and error
 * value: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
 * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useQuery<Value extends DocumentData = DocumentData>(
    query: Query<Value> | undefined | null,
    options?: UseQueryOptions,
): UseQueryResult<Value> {
    const { snapshotListenOptions = {} } = options ?? {};

    const onChange: UseListenOnChange<QuerySnapshot<Value>, FirestoreError, Query<Value>> = useCallback(
        (stableQuery, next, error) =>
            onSnapshot<Value>(stableQuery, snapshotListenOptions, {
                next,
                error,
            }),

        // TODO: add options as dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return useListen(query ?? undefined, onChange, isQueryEqual, LoadingState);
}
