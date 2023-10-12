import { DocumentData, FirestoreError, Query, SnapshotOptions } from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types.js";
import { useMultiGet } from "../internal/useMultiGet.js";
import { getDocsFromSource, isQueryEqual } from "./internal.js";
import type { Source } from "./types.js";

export type UseQueriesOnceResult<Values extends ReadonlyArray<DocumentData> = ReadonlyArray<DocumentData>> = {
    [Index in keyof Values]: ValueHookResult<Values[Index], FirestoreError>;
} & { length: Values["length"] };

/**
 * Options to configure the subscription
 */
export interface UseQueriesOnceOptions {
    source?: Source;
    snapshotOptions?: SnapshotOptions;
}

/**
 * Returns the QuerySnapshot of multiple Firestore queries. Does not update the data once initially fetched
 * @template Values Tuple of types of the collection data
 * @param queries Firestore queries that will be fetched
 * @param options Options to configure how the queries are fetched
 * @returns Array with tuple for each query:
 * - value: QuerySnapshot; `undefined` if query is currently being fetched, or an error occurred
 * - loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * - error: `undefined` if no error occurred
 */
export function useQueriesOnce<Values extends ReadonlyArray<DocumentData> = ReadonlyArray<DocumentData>>(
    queries: { [Index in keyof Values]: Query<Values[Index]> },
    options?: UseQueriesOnceOptions,
): UseQueriesOnceResult<Values> {
    const { source = "default" } = options ?? {};

    const getData = useCallback(
        async (stableQuery: Query<Values[number]>) => getDocsFromSource(stableQuery, source),
        [source],
    );

    // @ts-expect-error `useMultiGet` assumes a single value type
    return useMultiGet(queries, getData, isQueryEqual);
}
