import { FirestoreError, Query, getCountFromServer } from "firebase/firestore";
import type { ValueHookResult } from "../common/types.js";
import { useOnce } from "../internal/useOnce.js";
import { isQueryEqual } from "./internal.js";

export type UseCountFromServerResult = ValueHookResult<number, FirestoreError>;

async function getData(stableQuery: Query<unknown>) {
    const snap = await getCountFromServer(stableQuery);
    return snap.data().count;
}

/**
 * Returns the number of documents in the result set of a Firestore Query. Does not update the count once initially calculated.
 *
 * @param {Query<unknown> | undefined | null} query Firestore query whose result set size is calculated
 * @returns {UseCountFromServerResult} Size of the result set, loading state, and error
 * * value: Size of the result set; `undefined` if the result set size is currently being calculated, or an error occurred
 * * loading: `true` while calculating the result size set; `false` if the result size set was calculated successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useCountFromServer(query: Query<unknown> | undefined | null): UseCountFromServerResult {
    return useOnce(query ?? undefined, getData, isQueryEqual);
}
