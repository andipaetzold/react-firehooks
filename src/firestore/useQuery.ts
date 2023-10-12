import { DocumentData, FirestoreError, onSnapshot, Query, QuerySnapshot, SnapshotListenOptions } from "firebase/firestore";
import { useCallback } from "react";
import { ValueHookResult } from "../common/types.js";
import { useListen, UseListenOnChange } from "../internal/useListen.js";
import { LoadingState } from "../internal/useLoadingValue.js";
import { isQueryEqual } from "./internal.js";

export type UseQueryResult<AppModelType = DocumentData> = ValueHookResult<QuerySnapshot<AppModelType>, FirestoreError>;

/**
 * Options to configure the subscription
 */
export interface UseQueryOptions {
    snapshotListenOptions?: SnapshotListenOptions;
}

/**
 * Returns and updates a QuerySnapshot of a Firestore Query
 * @template AppModelType Shape of the data after it was converted from firestore
 * @template DbModelType Shape of the data in firestore
 * @param query Firestore query that will be subscribed to
 * @param options Options to configure the subscription
 * @returns QuerySnapshot, loading, and error
 * - value: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
 * - loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * - error: `undefined` if no error occurred
 */
export function useQuery<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>(
    query: Query<AppModelType, DbModelType> | undefined | null,
    options?: UseQueryOptions,
): UseQueryResult<AppModelType> {
    const { snapshotListenOptions } = options ?? {};
    const { includeMetadataChanges } = snapshotListenOptions ?? {};

    const onChange: UseListenOnChange<
        QuerySnapshot<AppModelType, DbModelType>,
        FirestoreError,
        Query<AppModelType, DbModelType>
    > = useCallback(
        (stableQuery, next, error) =>
            onSnapshot(
                stableQuery,
                { includeMetadataChanges },
                {
                    next,
                    error,
                },
            ),
        [includeMetadataChanges],
    );

    return useListen(query ?? undefined, onChange, isQueryEqual, LoadingState);
}
