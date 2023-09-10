import { DocumentData, FirestoreError, Query, SnapshotOptions } from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types.js";
import { useOnce } from "../internal/useOnce.js";
import { getDocsFromSource, isQueryEqual } from "./internal.js";
import type { Source } from "./types.js";

export type UseQueryDataOnceResult<Value extends DocumentData = DocumentData> = ValueHookResult<Value[], FirestoreError>;

/**
 * Options to configure the subscription
 */
export interface UseQueryDataOnceOptions {
    /**
     * @default "default"
     */
    source?: Source;

    snapshotOptions?: SnapshotOptions;

    /**
     * @default false
     */
    suspense?: boolean;
}

/**
 * Returns the data of a Firestore Query. Does not update the data once initially fetched
 *
 * @template Value Type of the collection data
 * @param {Query<Value> | undefined | null} query Firestore query that will be fetched
 * @param {?UseQueryDataOnceOptions} options Options to configure how the query is fetched
 * @returns {UseQueryDataOnceResult<Value>} Query data, loading state, and error
 * * value: Query data; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred; Always `false` with `supsense=true`
 * * error: `undefined` if no error occurred; Always `undefined` with `supsense=true`
 */
export function useQueryDataOnce<Value extends DocumentData = DocumentData>(
    query: Query<Value> | undefined | null,
    options?: UseQueryDataOnceOptions,
): UseQueryDataOnceResult<Value> {
    const { source = "default", snapshotOptions = {}, suspense = false } = options ?? {};

    const getData = useCallback(async (stableQuery: Query<Value>) => {
        const snap = await getDocsFromSource(stableQuery, source);
        return snap.docs.map((doc) => doc.data(snapshotOptions));

        // TODO: add options as dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return useOnce(query ?? undefined, getData, isQueryEqual, suspense);
}
