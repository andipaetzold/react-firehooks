import { DocumentData, DocumentReference, DocumentSnapshot, FirestoreError } from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types.js";
import { useOnce } from "../internal/useOnce.js";
import { getDocFromSource, isDocRefEqual } from "./internal.js";
import type { Source } from "./types.js";

export type UseDocumentOnceResult<Value extends DocumentData = DocumentData> = ValueHookResult<
    DocumentSnapshot<Value>,
    FirestoreError
>;

/**
 * Options to configure how the document is fetched
 */
export interface UseDocumentOnceOptions {
    /**
     * @default "default"
     */
    source?: Source;

    /**
     * @default false
     */
    suspense?: boolean;
}

/**
 * Returns the DocumentSnapshot of a Firestore DocumentReference. Does not update the DocumentSnapshot once initially fetched
 *
 * @template Value Type of the document data
 * @param {DocumentReference<Value> | undefined | null} reference Firestore DocumentReference that will be fetched
 * @param {?UseDocumentOnceOptions} options Options to configure how the document is fetched
 * @returns {UseDocumentOnceResult<Value>} DocumentSnapshot, loading state, and error
 * * value: DocumentSnapshot; `undefined` if document does not exist, is currently being fetched, or an error occurred
 * * loading: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred; Always `false` with `supsense=true`
 * * error: `undefined` if no error occurred; Always `undefined` with `supsense=true`
 */
export function useDocumentOnce<Value extends DocumentData = DocumentData>(
    reference: DocumentReference<Value> | undefined | null,
    options?: UseDocumentOnceOptions,
): UseDocumentOnceResult<Value> {
    const { source = "default", suspense = false } = options ?? {};

    const getData = useCallback(
        (stableRef: DocumentReference<Value>) => getDocFromSource(stableRef, source),
        // TODO: add options as dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
    return useOnce(reference ?? undefined, getData, isDocRefEqual, suspense);
}
