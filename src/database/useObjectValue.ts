import { onValue, Query } from "firebase/database";
import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common";
import { useLoadingValue } from "../util/useLoadingValue";
import { useStableQuery } from "./internal";

export type UseObjectValueResult<Value = unknown> = ValueHookResult<Value, Error>;

export function useObjectValue<Value = unknown>(query: Query | undefined | null): UseObjectValueResult<Value> {
    const { error, loading, setLoading, setError, setValue, value } = useLoadingValue<Value, Error>();

    const stableQuery = useStableQuery(query ?? undefined);

    useEffect(() => {
        if (stableQuery === undefined) {
            setValue();
        } else {
            setLoading();

            const unsubscribe = onValue(stableQuery, (snap) => setValue(snap.val()), setError);
            return () => unsubscribe();
        }
    }, [stableQuery]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
