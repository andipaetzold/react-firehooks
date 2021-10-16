import { DataSnapshot, onValue, Query } from "firebase/database";
import { ValueHookResult } from "../common";
import { useListen } from "../internal/useListen";
import { isQueryEqual } from "./internal";

export type UseObjectResult = ValueHookResult<DataSnapshot, Error>;

/**
 * Returns the DataSnapshot of the Realtime Database query
 *
 * @param {Query | undefined | null} query Realtime Database query
 * @returns {UseObjectResult} User, loading state, and error
 * * value: DataSnapshot; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useObject(query: Query | undefined | null): UseObjectResult {
    return useListen(query ?? undefined, onValue, isQueryEqual);
}
