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

/**
 * Options to configure the subscription
 */
export interface UseDocumentDataOptions {
    snapshotListenOptions?: SnapshotListenOptions;
    snapshotOptions?: SnapshotOptions;
}

/**
 * Returns and updates the data of a Firestore DocumentReference
 *
 * @template {Value} Type of the document data
 * @param {DocumentReference<Value> | undefined | null} query Firestore DocumentReference that will be subscribed to
 * @param {?UseDocumentDataOptions} options Options to configure the subscription
 * @returns {UseDocumentDataResult<Value>} Document data, loading state, and error
 * * value: Document data; `undefined` if document does not exist, is currently being fetched, or an error occurred
 * * loading: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useDocumentData<Value extends DocumentData = DocumentData>(
    reference: DocumentReference<Value> | undefined | null,
    options?: UseDocumentDataOptions
): UseDocumentDataResult<Value> {
    const { snapshotListenOptions = {}, snapshotOptions } = options ?? {};

    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<Value, FirestoreError>();

    const stableDocRef = useStableDocRef(reference ?? undefined);

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
