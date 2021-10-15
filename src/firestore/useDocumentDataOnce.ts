import { DocumentData, DocumentReference, FirestoreError, SnapshotOptions } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import type { ValueHookResult } from "../common/types";
import { useIsMounted } from "../util/useIsMounted";
import { useLoadingValue } from "../util/useLoadingValue";
import { getDocFromSource, useStableDocRef } from "./internal";
import type { Source } from "./types";

export type UseDocumentDataOnceResult<Value extends DocumentData = DocumentData> = ValueHookResult<Value, FirestoreError>;

export interface UseDocumentDataOnceOptions {
    source?: Source;
    snapshotOptions?: SnapshotOptions;
}

export function useDocumentDataOnce<Value extends DocumentData = DocumentData>(
    reference: DocumentReference<Value> | undefined | null,
    { source = "default", snapshotOptions }: UseDocumentDataOnceOptions = {}
): UseDocumentDataOnceResult<Value> {
    const isMounted = useIsMounted();
    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<Value, FirestoreError>();

    const stableDocRef = useStableDocRef(reference ?? undefined);

    useEffect(() => {
        (async () => {
            if (stableDocRef === undefined) {
                setValue();
            } else {
                setLoading();

                try {
                    const snap = await getDocFromSource<Value>(stableDocRef, source);

                    if (!isMounted.current) {
                        return;
                    }

                    setValue(snap.data(snapshotOptions));
                } catch (e) {
                    if (!isMounted.current) {
                        return;
                    }

                    // We assume this is always a FirestoreError
                    setError(e as FirestoreError);
                }
            }
        })();
    }, [stableDocRef]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}