import { DocumentData, DocumentReference, DocumentSnapshot } from "firebase/firestore";
import { useCallback } from "react";
import { useOnceSuspense } from "../internal/useOnceSuspense.js";
import { getDocFromSource, isDocRefEqual } from "./internal.js";
import type { Source } from "./types.js";

export type UseDocumentSuspenseResult<Value extends DocumentData = DocumentData> = DocumentSnapshot<Value> | undefined;

/**
 * Options to configure how the document is fetched
 */
export interface UseDocumentSuspenseOptions {
    source?: Source;
}

/**
 * Returns the DocumentSnapshot of a Firestore DocumentReference. To be used within `<Suspense>`.
 *
 * @template Value Type of the document data
 * @param {DocumentReference<Value> | undefined | null} reference Firestore DocumentReference that will be fetched
 * @param {?UseDocumentSuspenseOptions} options Options to configure how the document is fetched
 * @returns {UseDocumentSuspenseResult<Value>} Getter that returns `DocumentSnapshot`; returns `undefined` if document does not exist
 */
export function useDocumentSuspense<Value extends DocumentData = DocumentData>(
    reference: DocumentReference<Value> | undefined | null,
    options?: UseDocumentSuspenseOptions,
): UseDocumentSuspenseResult<Value> {
    const { source = "default" } = options ?? {};

    const getData = useCallback((stableRef: DocumentReference<Value>) => getDocFromSource(stableRef, source), []);
    return useOnceSuspense(reference ?? undefined, getData, isDocRefEqual);
}
