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

/**
 * Options to configure the subscription
 */
export interface UseDocumentOptions {
    snapshotListenOptions?: SnapshotListenOptions;
}

/**
 * Returns and updates a DocumentSnapshot of a Firestore DocumentReference
 *
 * @param {DocumentReference<Value> | undefined | null} query Firestore DocumentReference that will be subscribed to
 * @param {?UseDocumentOptions} options Options to configure the subscription
 * @returns {UseDocumentResult<Value>} Document snapshot, loading state, and error
 * * value: DocumentSnapshot; `undefined` if document does not exist, is currently being fetched, or an error occurred
 * * loading: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useDocument<Value extends DocumentData = DocumentData>(
    reference: DocumentReference<Value> | undefined | null,
    options?: UseDocumentOptions
): UseDocumentResult<Value> {
    const { snapshotListenOptions = {} } = options ?? {};

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
