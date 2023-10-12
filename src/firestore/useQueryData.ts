import { DocumentData, FirestoreError, onSnapshot, Query, SnapshotListenOptions, SnapshotOptions } from "firebase/firestore";
import { useCallback } from "react";
import { ValueHookResult } from "../common/types.js";
import { useListen, UseListenOnChange } from "../internal/useListen.js";
import { LoadingState } from "../internal/useLoadingValue.js";
import { isQueryEqual } from "./internal.js";

export type UseQueryDataResult<AppModelType = DocumentData> = ValueHookResult<AppModelType[], FirestoreError>;

/**
 * Options to configure the subscription
 */
export interface UseQueryDataOptions<AppModelType = DocumentData> {
    snapshotListenOptions?: SnapshotListenOptions;
    snapshotOptions?: SnapshotOptions;
    initialValue?: AppModelType[];
}

/**
 * Returns and updates a the document data of a Firestore Query
 * @template AppModelType Shape of the data after it was converted from firestore
 * @template DbModelType Shape of the data in firestore
 * @param query Firestore query that will be subscribed to
 * @param options Options to configure the subscription
 * `initialValue`: Value that is returned while the query is being fetched.
 * @returns Query data, loading state, and error
 * - value: Query data; `undefined` if query is currently being fetched, or an error occurred
 * - loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * - error: `undefined` if no error occurred
 */
export function useQueryData<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>(
    query: Query<AppModelType, DbModelType> | undefined | null,
    options?: UseQueryDataOptions<AppModelType>,
): UseQueryDataResult<AppModelType> {
    const { snapshotListenOptions, snapshotOptions } = options ?? {};
    const { includeMetadataChanges } = snapshotListenOptions ?? {};
    const { serverTimestamps } = snapshotOptions ?? {};

    const onChange: UseListenOnChange<AppModelType[], FirestoreError, Query<AppModelType, DbModelType>> = useCallback(
        (stableQuery, next, error) =>
            onSnapshot(
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
