import { DataSnapshot, onValue, Query } from "firebase/database";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/index.js";
import { useListen, UseListenOnChange } from "../internal/useListen.js";
import { LoadingState } from "../internal/useLoadingValue.js";
import { isQueryEqual } from "./internal.js";

export type UseObjectValueResult<Value = unknown> = ValueHookResult<Value, Error>;

export type UseObjectValueConverter<Value> = (snap: DataSnapshot) => Value;

export interface UseObjectValueOptions<Value> {
    converter?: UseObjectValueConverter<Value>;
}

/**
 * Returns and updates the DataSnapshot of the Realtime Database query
 *
 * @template Value Type of the object value
 * @param {Query | undefined | null} query Realtime Database query
 * @param {?UseObjectValueOptions} options Options to configure how the object is fetched
 * * `converter`: Function to extract the desired data from the DataSnapshot. Similar to Firestore converters. Default: `snap.val()`.
 * @returns {UseObjectValueResult} User, loading state, and error
 * * value: Object value; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useObjectValue<Value = unknown>(
    query: Query | undefined | null,
    options?: UseObjectValueOptions<Value>
): UseObjectValueResult<Value> {
    const { converter = (snap: DataSnapshot) => snap.val() } = options ?? {};

    const onChange: UseListenOnChange<Value, Error, Query> = useCallback(
        (stableQuery, next, error) => onValue(stableQuery, (snap) => next(converter(snap)), error),
        []
    );

    return useListen(query ?? undefined, onChange, isQueryEqual, LoadingState);
}
