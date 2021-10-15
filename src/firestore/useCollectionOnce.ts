import { DocumentData, FirestoreError, Query, QuerySnapshot } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import type { ValueHookResult } from "../common/types";
import { useIsMounted } from "../util/useIsMounted";
import { useLoadingValue } from "../util/useLoadingValue";
import { getDocsFromSource, useStableQuery } from "./internal";
import type { Source } from "./types";

export type UseCollectionOnceResult<Value extends DocumentData = DocumentData> = ValueHookResult<
    QuerySnapshot<Value>,
    FirestoreError
>;

/**
 * Options to configure how the query is fetched
 */
export interface UseCollectionOnceOptions {
    source?: Source;
}

/**
 * Returns the QuerySnapshot of a Firestore Query. Does not update the QuerySnapshot once initially fetched
 *
 * @template {Value} Type of the collection data
 * @param {Query<Value> | undefined | null} query Firestore query that will be fetched
 * @param {?UseCollectionOnceOptions} options Options to configure how the query is fetched
 * @returns {UseCollectionOnceResult<Value>} QuerySnapshot, loading state, and error
 * * value: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useCollectionOnce<Value extends DocumentData = DocumentData>(
    query: Query<Value> | undefined | null,
    options?: UseCollectionOnceOptions
): UseCollectionOnceResult<Value> {
    const { source = "default" } = options ?? {};

    const isMounted = useIsMounted();
    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<
        QuerySnapshot<Value>,
        FirestoreError
    >();

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

                    setValue(snap);
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
