import { onValue, Query } from "firebase/database";
import { useCallback } from "react";
import { ValueHookResult } from "../common";
import { useListen, UseListenOnChange } from "../internal/useListen";
import { isQueryEqual } from "./internal";

export type UseObjectValueResult<Value = unknown> = ValueHookResult<Value, Error>;

/**
 * Returns and updates the DataSnapshot of the Realtime Database query
 *
 * @template {Value} Type of the object value
 * @param {Query | undefined | null} query Realtime Database query
 * @returns {UseObjectValueResult} User, loading state, and error
 * * value: Object value; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useObjectValue<Value = unknown>(query: Query | undefined | null): UseObjectValueResult<Value> {
    const onChange: UseListenOnChange<Value, Error, Query> = useCallback(
        (stableQuery, next, error) => onValue(stableQuery, (snap) => next(snap.val()), error),
        []
    );

    return useListen(query ?? undefined, onChange, isQueryEqual);
}
