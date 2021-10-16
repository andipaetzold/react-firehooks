import { DocumentData, FirestoreError, onSnapshot, Query, SnapshotListenOptions, SnapshotOptions } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common/types";
import { useLoadingValue } from "../internal/useLoadingValue";
import { useStableQuery } from "./internal";

export type UseCollectionDataResult<Value extends DocumentData = DocumentData> = ValueHookResult<Value[], FirestoreError>;

/**
 * Options to configure the subscription
 */
export interface UseCollectionDataOptions {
    snapshotListenOptions?: SnapshotListenOptions;
    snapshotOptions?: SnapshotOptions;
}

/**
 * Returns and updates a the document data of a Firestore Query
 *
 * @template {Value} Type of the collection data
 * @param {Query<Value> | undefined | null} query Firestore query that will be subscribed to
 * @param {?UseCollectionDataOptions} options Options to configure the subscription
 * @returns {UseCollectionDataResult<Value>} Query data, loading state, and error
 * * value: Query data; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useCollectionData<Value extends DocumentData = DocumentData>(
    query: Query<Value> | undefined | null,
    options?: UseCollectionDataOptions
): UseCollectionDataResult<Value> {
    const { snapshotListenOptions = {}, snapshotOptions = {} } = options ?? {};

    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<Value[], FirestoreError>();

    const stableQuery = useStableQuery(query ?? undefined);

    useEffect(() => {
        if (stableQuery === undefined) {
            setValue();
        } else {
            setLoading();

            const unsubscribe = onSnapshot<Value>(stableQuery, snapshotListenOptions, {
                next: (snap) => setValue(snap.docs.map((doc) => doc.data(snapshotOptions))),
                error: setError,
            });

            return () => unsubscribe();
        }
    }, [stableQuery]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
