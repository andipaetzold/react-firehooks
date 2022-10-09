import { FirestoreError, getCountFromServer, Query } from "firebase/firestore";
import type { ValueHookResult } from "../common/types.js";
import { useOnce } from "../internal/useOnce.js";
import { isQueryEqual } from "./internal.js";

export type UseCountFromServerResult = ValueHookResult<number, FirestoreError>;

async function getData(stableQuery: Query<unknown>) {
    const snap = await getCountFromServer(stableQuery);
    return snap.data().count;
}

/**
 * Returns the number of documents in the result set of of a Firestore Query. Does not update the data once initially fetched.
 *
 * @param {Query<unknown> | undefined | null} query Firestore query whose result set size is calculated
 * @returns {UseCountFromServerResult} Size of the result set, loading state, and error
 * * value: Size of the result set; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useCountFromServer(query: Query<unknown> | undefined | null): UseCountFromServerResult {
    return useOnce(query ?? undefined, getData, isQueryEqual);
}
