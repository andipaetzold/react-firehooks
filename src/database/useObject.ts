import { DataSnapshot, onValue, Query } from "firebase/database";
import type { ValueHookResult } from "../common/index.js";
import { useListen } from "../internal/useListen.js";
import { LoadingState } from "../internal/useLoadingValue.js";
import { isQueryEqual } from "./internal.js";

export type UseObjectResult = ValueHookResult<DataSnapshot, Error>;

/**
 * Returns the DataSnapshot of the Realtime Database query
 * @param query Realtime Database query
 * @returns User, loading state, and error
 * value: DataSnapshot; `undefined` if query is currently being fetched, or an error occurred
 * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useObject(query: Query | undefined | null): UseObjectResult {
    return useListen(query ?? undefined, onValue, isQueryEqual, LoadingState);
}
