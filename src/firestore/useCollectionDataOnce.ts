import { DocumentData, FirestoreError, Query, QuerySnapshot, SnapshotOptions } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import type { ValueHookResult } from "../common/types";
import { useIsMounted } from "../util/useIsMounted";
import { useLoadingValue } from "../util/useLoadingValue";
import { getDocsFromSource, useStableQuery } from "./internal";
import type { GetOptions } from "./types";

export type UseCollectionDataOnceResult<Value extends DocumentData = DocumentData> = ValueHookResult<
    Value[],
    FirestoreError
>;

export interface UseCollectionDataOnceOptions {
    getOptions?: GetOptions;
    snapshotOptions?: SnapshotOptions;
}

export function useCollectionDataOnce<Value extends DocumentData = DocumentData>(
    query: Query<Value> | undefined | null,
    { getOptions: { source = "default" } = {}, snapshotOptions = {} }: UseCollectionDataOnceOptions = {}
): UseCollectionDataOnceResult<Value> {
    const isMounted = useIsMounted();
    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<Value[], FirestoreError>();

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

                    setValue(snap.docs.map((doc) => doc.data(snapshotOptions)));
                } catch (e) {
                    if (!isMounted.current) {
                        return;
                    }

                    // We assume this is always a FirestoreError
                    setError(e as unknown as FirestoreError);
                }
            }
        })();
    }, [stableQuery]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
