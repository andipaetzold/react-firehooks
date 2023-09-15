import { DocumentData, FirestoreError, Query, SnapshotOptions } from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types.js";
import { useMultiGet } from "../internal/useMultiGet.js";
import { getDocsFromSource, isQueryEqual } from "./internal.js";
import type { Source } from "./types.js";

export type UseQueriesDataOnceResult<Values extends ReadonlyArray<DocumentData> = ReadonlyArray<DocumentData>> = {
    [Index in keyof Values]: ValueHookResult<Values[Index], FirestoreError>;
} & { length: Values["length"] };

/**
 * Options to configure the subscription
 */
export interface UseQueriesDataOnceOptions {
    source?: Source;
    snapshotOptions?: SnapshotOptions;
}

/**
 * Returns the data of multiple Firestore queries. Does not update the data once initially fetched
 * @template Value Type of the collection data
 * @param queries Firestore queries that will be fetched
 * @param options Options to configure how the queries are fetched
 * @returns Array with tuple for each query:
 * value: Query data; `undefined` if query is currently being fetched, or an error occurred
 * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useQueriesDataOnce<Values extends ReadonlyArray<DocumentData> = ReadonlyArray<DocumentData>>(
    queries: { [Index in keyof Values]: Query<Values[Index]> },
    options?: UseQueriesDataOnceOptions,
): UseQueriesDataOnceResult<Values> {
    const { source = "default", snapshotOptions = {} } = options ?? {};

    const getData = useCallback(async (stableQuery: Query<Values[number]>) => {
        const snap = await getDocsFromSource(stableQuery, source);
        return snap.docs.map((doc) => doc.data(snapshotOptions));

        // TODO: add options as dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // @ts-expect-error `useMultiGet` assumes a single value type
    return useMultiGet(queries, getData, isQueryEqual);
}
