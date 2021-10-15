import { DocumentData, DocumentReference, DocumentSnapshot, FirestoreError } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import type { ValueHookResult } from "../common/types";
import { useIsMounted } from "../util/useIsMounted";
import { useLoadingValue } from "../util/useLoadingValue";
import { getDocFromSource, useStableDocRef } from "./internal";
import type { Source } from "./types";

export type UseDocumentOnceResult<Value extends DocumentData = DocumentData> = ValueHookResult<
    DocumentSnapshot<Value>,
    FirestoreError
>;

/**
 * Options to configure how the document is fetched
 */
export interface UseDocumentOnceOptions {
    source?: Source;
}

/**
 * Returns the DocumentSnapshot of a Firestore DocumentReference. Does not update the DocumentSnapshot once initially fetched
 *
 * @param {DocumentReference<Value> | undefined | null} query Firestore DocumentReference that will be fetched
 * @param {?UseDocumentOnceOptions} options Options to configure how the document is fetched
 * @returns {UseDocumentOnceResult<Value>} DocumentSnapshot, loading state, and error
 * * value: DocumentSnapshot; `undefined` if document does not exist, is currently being fetched, or an error occurred
 * * loading: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useDocumentOnce<Value extends DocumentData = DocumentData>(
    reference: DocumentReference<Value> | undefined | null,
    options?: UseDocumentOnceOptions
): UseDocumentOnceResult<Value> {
    const { source = "default" } = options ?? {};

    const isMounted = useIsMounted();
    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<
        DocumentSnapshot<Value>,
        FirestoreError
    >();

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
    }, [stableDocRef]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
