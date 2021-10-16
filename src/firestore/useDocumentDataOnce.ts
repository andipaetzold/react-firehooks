import { DocumentData, DocumentReference, FirestoreError, SnapshotOptions } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import type { ValueHookResult } from "../common/types";
import { useIsMounted } from "../internal/useIsMounted";
import { useLoadingValue } from "../internal/useLoadingValue";
import { getDocFromSource, useStableDocRef } from "./internal";
import type { Source } from "./types";

export type UseDocumentDataOnceResult<Value extends DocumentData = DocumentData> = ValueHookResult<Value, FirestoreError>;

/**
 * Options to configure how the document is fetched
 */
export interface UseDocumentDataOnceOptions {
    source?: Source;
    snapshotOptions?: SnapshotOptions;
}

/**
 * Returns the data of a Firestore DocumentReference
 *
 * @template {Value} Type of the document data
 * @param {DocumentReference<Value> | undefined | null} query Firestore DocumentReference that will be subscribed to
 * @param {?UseDocumentDataOnceOptions} options  Options to configure how the document is fetched
 * @returns {UseDocumentDataOnceResult<Value>} Document data, loading state, and error
 * * value: Document data; `undefined` if document does not exist, is currently being fetched, or an error occurred
 * * loading: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useDocumentDataOnce<Value extends DocumentData = DocumentData>(
    reference: DocumentReference<Value> | undefined | null,
    options?: UseDocumentDataOnceOptions
): UseDocumentDataOnceResult<Value> {
    const { source = "default", snapshotOptions } = options ?? {};

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
