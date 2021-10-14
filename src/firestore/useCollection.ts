import { DocumentData, FirestoreError, onSnapshot, Query, QuerySnapshot, SnapshotListenOptions } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common/types";
import { useLoadingValue } from "../util/useLoadingValue";
import { useStableQuery } from "./internal";

export type UseCollectionResult<Value extends DocumentData = DocumentData> = ValueHookResult<
    QuerySnapshot<Value>,
    FirestoreError
>;

export interface UseCollectionOptions {
    snapshotListenOptions?: SnapshotListenOptions;
}

export function useCollection<Value extends DocumentData = DocumentData>(
    query: Query<Value> | undefined | null,
    { snapshotListenOptions = {} }: UseCollectionOptions = {}
): UseCollectionResult<Value> {
    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<
        QuerySnapshot<Value>,
        FirestoreError
    >();

    const stableQuery = useStableQuery(query ?? undefined);

    useEffect(() => {
        if (stableQuery === undefined) {
            setValue();
        } else {
            setLoading();

            const unsubscribe = onSnapshot<Value>(stableQuery, snapshotListenOptions, {
                next: setValue,
                error: setError,
            });

            return () => unsubscribe();
        }
    }, [stableQuery]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
