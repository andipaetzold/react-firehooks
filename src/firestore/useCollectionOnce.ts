import { DocumentData, FirestoreError, Query, QuerySnapshot, SnapshotOptions } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import type { ValueHookResult } from "../common/types";
import { useIsMounted } from "../util/useIsMounted";
import { useLoadingValue } from "../util/useLoadingValue";
import { getDocsFromSource, useStableQuery } from "./internal";
import type { GetOptions } from "./types";

export type UseCollectionOnceResult<Value extends DocumentData = DocumentData> = ValueHookResult<
    QuerySnapshot<Value>,
    FirestoreError
>;

export interface UseCollectionOnceOptions {
    getOptions?: GetOptions;
}

export function useCollectionOnce<Value extends DocumentData = DocumentData>(
    query: Query<Value> | undefined | null,
    { getOptions: { source = "default" } = {} }: UseCollectionOnceOptions = {}
): UseCollectionOnceResult<Value> {
    const isMounted = useIsMounted();
    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<
        QuerySnapshot<Value>,
        FirestoreError
    >();

    const stableQuery = useStableQuery(query ?? undefined);

    useEffect(() => {
        (async () => {
            if (stableQuery === undefined) {
                setValue();
            } else {
                setLoading();

                try {
                    const snap = await getDocsFromSource<Value>(stableQuery, source);

                    if (!isMounted.current) {
                        return;
                    }

                    setValue(snap);
                } catch (e) {
                    if (!isMounted.current) {
                        return;
                    }

                    // We assume this is always a FirestoreError
                    setError(e as FirestoreError);
                }
            }
        })();
    }, [stableQuery]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
