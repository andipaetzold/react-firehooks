import { DocumentData, FirestoreError, onSnapshot, Query, SnapshotListenOptions, SnapshotOptions } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common/types";
import { useLoadingValue } from "../util/useLoadingValue";
import { useStableQuery } from "./internal";

export type UseCollectionDataResult<Value extends DocumentData = DocumentData> = ValueHookResult<
    Value[] | undefined,
    FirestoreError
>;

export interface UseCollectionDataOptions {
    snapshotListenOptions?: SnapshotListenOptions;
    snapshotOptions?: SnapshotOptions;
}

export function useCollectionData<Value extends DocumentData = DocumentData>(
    query: Query<Value> | undefined | null,
    { snapshotListenOptions = {}, snapshotOptions = {} }: UseCollectionDataOptions = {}
): UseCollectionDataResult<Value> {
    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<Value[], FirestoreError>();

    const stableQuery = useStableQuery(query ?? undefined);

    useEffect(() => {
        if (stableQuery === undefined) {
            setValue();
        } else {
            setLoading();

            const unsubscribe = onSnapshot<Value>(stableQuery, snapshotListenOptions, {
                next: (snap) => setValue(snap.docs.map((doc) => doc.data(snapshotOptions))),
                error: setError,
            });

            return () => unsubscribe();
        }
    }, [stableQuery]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
