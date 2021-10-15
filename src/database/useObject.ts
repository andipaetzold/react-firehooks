import { DataSnapshot, get, Query } from "firebase/database";
import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common";
import { useIsMounted } from "../util/useIsMounted";
import { useLoadingValue } from "../util/useLoadingValue";
import { useStableQuery } from "./internal";

export type UseObjectOnceResult = ValueHookResult<DataSnapshot, Error>;

export function useObjectOnce(query: Query | undefined | null): UseObjectOnceResult {
    const isMounted = useIsMounted();
    const { error, loading, setLoading, setError, setValue, value } = useLoadingValue<DataSnapshot, Error>();

    const stableQuery = useStableQuery(query ?? undefined);

    useEffect(() => {
        (async () => {
            if (stableQuery === undefined) {
                setValue();
            } else {
                setLoading();

                try {
                    const snap = await get(stableQuery);
                    if (!isMounted.current) {
                        return;
                    }

                    setValue(snap);
                } catch (e) {
                    if (!isMounted.current) {
                        return;
                    }

                    setError(e as Error);
                }
            }
        })();
    }, [stableQuery]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}