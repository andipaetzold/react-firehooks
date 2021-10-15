import { DocumentData, FirestoreError, Query, SnapshotOptions } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import type { ValueHookResult } from "../common/types";
import { useIsMounted } from "../util/useIsMounted";
import { useLoadingValue } from "../util/useLoadingValue";
import { getDocsFromSource, useStableQuery } from "./internal";
import type { Source } from "./types";

export type UseCollectionDataOnceResult<Value extends DocumentData = DocumentData> = ValueHookResult<
    Value[],
    FirestoreError
>;

/**
 * Options to configure the subscription
 */
export interface UseCollectionDataOnceOptions {
    source?: Source;
    snapshotOptions?: SnapshotOptions;
}

/**
 * Returns the data of a Firestore Query. Does not update the data once initially fetched
 *
 * @template {Value} Type of the collection data
 * @param {Query<Value> | undefined | null} query Firestore query that will be fetched
 * @param {?UseCollectionDataOnceOptions} options Options to configure how the query is fetched
 * @returns {UseCollectionDataOnceResult<Value>} Query data, loading state, and error
 * * value: Query data; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useCollectionDataOnce<Value extends DocumentData = DocumentData>(
    query: Query<Value> | undefined | null,
    options?: UseCollectionDataOnceOptions
): UseCollectionDataOnceResult<Value> {
    const { source = "default", snapshotOptions = {} } = options ?? {};

    const isMounted = useIsMounted();
    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<Value[], FirestoreError>();

    const stableQuery = useStableQuery(query ?? undefined);

    useEffect(() => {
        (async () => {
            if (stableQuery === undefined) {
                setValue();
            } else {
                setLoading();

                try {
                    const snap = await getDocsFromSource<Value>(stableQuery, source);

                    if (!isMounted.current) {
                        return;
                    }

                    setValue(snap.docs.map((doc) => doc.data(snapshotOptions)));
                } catch (e) {
                    if (!isMounted.current) {
                        return;
                    }

                    // We assume this is always a FirestoreError
                    setError(e as FirestoreError);
                }
            }
        })();
    }, [stableQuery]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
