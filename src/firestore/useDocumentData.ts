import { useLoadingValue } from "../util/useLoadingValue";
import {
    DocumentData,
    DocumentReference,
    FirestoreError,
    onSnapshot,
    SnapshotListenOptions,
    SnapshotOptions,
} from "firebase/firestore";
import { useEffect, useMemo } from "react";
import type { ValueHookResult } from "../common/types";
import { useStableDocRef } from "./internal";

export type UseDocumentDataResult<Value extends DocumentData = DocumentData> = ValueHookResult<Value, FirestoreError>;

export interface UseDocumentDataOptions {
    snapshotListenOptions?: SnapshotListenOptions;
    snapshotOptions?: SnapshotOptions;
}

export function useDocumentData<Value extends DocumentData = DocumentData>(
    reference: DocumentReference<Value> | undefined,
    { snapshotListenOptions = {}, snapshotOptions }: UseDocumentDataOptions ={}
): UseDocumentDataResult<Value> {
    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<Value, FirestoreError>();

    const stableDocRef = useStableDocRef(reference);

    useEffect(() => {
        if (stableDocRef === undefined) {
            setValue();
        } else {
            setLoading();

            const unsubscribe = onSnapshot<Value>(stableDocRef, snapshotListenOptions, {
                next: (snap) => setValue(snap.data(snapshotOptions)),
                error: setError,
            });

            return () => unsubscribe();
        }
    }, [stableDocRef]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
