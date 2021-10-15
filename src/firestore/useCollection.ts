import { DocumentData, FirestoreError, onSnapshot, Query, QuerySnapshot, SnapshotListenOptions } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common/types";
import { useLoadingValue } from "../util/useLoadingValue";
import { useStableQuery } from "./internal";

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

    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<
        QuerySnapshot<Value>,
        FirestoreError
    >();

    const stableQuery = useStableQuery(query ?? undefined);

    useEffect(() => {
        if (stableQuery === undefined) {
            setValue();
        } else {
            setLoading();

            const unsubscribe = onSnapshot<Value>(stableQuery, snapshotListenOptions, {
                next: setValue,
                error: setError,
            });

            return () => unsubscribe();
        }
    }, [stableQuery]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
