import {
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    FirestoreError,
    onSnapshot,
    SnapshotListenOptions,
} from "firebase/firestore";
import { useEffect, useMemo } from "react";
import type { ValueHookResult } from "../common/types";
import { useLoadingValue } from "../util/useLoadingValue";
import { useStableDocRef } from "./internal";

export type UseDocumentResult<Value extends DocumentData = DocumentData> = ValueHookResult<
    DocumentSnapshot<Value>,
    FirestoreError
>;

export interface UseDocumentOptions {
    snapshotListenOptions?: SnapshotListenOptions;
}

export function useDocument<Value extends DocumentData = DocumentData>(
    reference: DocumentReference<Value> | undefined | null,
    { snapshotListenOptions = {} }: UseDocumentOptions = {}
): UseDocumentResult<Value> {
    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<
        DocumentSnapshot<Value>,
        FirestoreError
    >();

    const stableDocRef = useStableDocRef(reference ?? undefined);

    useEffect(() => {
        if (stableDocRef === undefined) {
            setValue();
        } else {
            setLoading();

            const unsubscribe = onSnapshot<Value>(stableDocRef, snapshotListenOptions, {
                next: setValue,
                error: setError,
            });

            return () => unsubscribe();
        }
    }, [stableDocRef]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
