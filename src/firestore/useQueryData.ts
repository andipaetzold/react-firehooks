import { DocumentData, FirestoreError, onSnapshot, Query, SnapshotListenOptions, SnapshotOptions } from "firebase/firestore";
import { useCallback } from "react";
import { ValueHookResult } from "../common/types.js";
import { useListen, UseListenOnChange } from "../internal/useListen.js";
import { LoadingState } from "../internal/useLoadingValue.js";
import { isQueryEqual } from "./internal.js";

export type UseQueryDataResult<Value extends DocumentData = DocumentData> = ValueHookResult<Value[], FirestoreError>;

/**
 * Options to configure the subscription
 */
export interface UseQueryDataOptions<Value extends DocumentData = DocumentData> {
    snapshotListenOptions?: SnapshotListenOptions;
    snapshotOptions?: SnapshotOptions;
    initialValue?: Value[];
}

/**
 * Returns and updates a the document data of a Firestore Query
 * @template Value Type of the collection data
 * @param query Firestore query that will be subscribed to
 * @param options Options to configure the subscription
 * `initialValue`: Value that is returned while the query is being fetched.
 * @returns Query data, loading state, and error
 * - value: Query data; `undefined` if query is currently being fetched, or an error occurred
 * - loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * - error: `undefined` if no error occurred
 */
export function useQueryData<Value extends DocumentData = DocumentData>(
    query: Query<Value> | undefined | null,
    options?: UseQueryDataOptions<Value>,
): UseQueryDataResult<Value> {
    const { snapshotListenOptions, snapshotOptions } = options ?? {};
    const { includeMetadataChanges } = snapshotListenOptions ?? {};
    const { serverTimestamps } = snapshotOptions ?? {};

    const onChange: UseListenOnChange<Value[], FirestoreError, Query<Value>> = useCallback(
        (stableQuery, next, error) =>
            onSnapshot<Value>(
                stableQuery,
                { includeMetadataChanges },
                {
                    next: (snap) =>
                        next(
                            snap.docs.map((doc) =>
                                doc.data({
                                    serverTimestamps,
                                }),
                            ),
                        ),
                    error,
                },
            ),
        [includeMetadataChanges, serverTimestamps],
    );

    return useListen(query ?? undefined, onChange, isQueryEqual, options?.initialValue ?? LoadingState);
}
