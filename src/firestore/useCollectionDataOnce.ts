import { DocumentData, FirestoreError, Query, SnapshotOptions } from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types";
import { useOnce } from "../internal/useOnce";
import { getDocsFromSource, isQueryEqual } from "./internal";
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
 * @template Value Type of the collection data
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

    const getData = useCallback(async (stableQuery: Query<Value>) => {
        const snap = await getDocsFromSource(stableQuery, source);
        return snap.docs.map((doc) => doc.data(snapshotOptions));
    }, []);
    return useOnce(query ?? undefined, getData, isQueryEqual);
}
