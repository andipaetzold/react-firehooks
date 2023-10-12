import { DocumentData, DocumentReference, DocumentSnapshot, FirestoreError } from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types.js";
import { useGet } from "../internal/useGet.js";
import { getDocFromSource, isDocRefEqual } from "./internal.js";
import type { Source } from "./types.js";

export type UseDocumentOnceResult<AppModelType = DocumentData> = ValueHookResult<
    DocumentSnapshot<AppModelType>,
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
 * @template AppModelType Shape of the data after it was converted from firestore
 * @template DbModelType Shape of the data in firestore
 * @param reference Firestore DocumentReference that will be fetched
 * @param options Options to configure how the document is fetched
 * @returns DocumentSnapshot, loading state, and error
 * - value: DocumentSnapshot; `undefined` if document does not exist, is currently being fetched, or an error occurred
 * - loading: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
 * - error: `undefined` if no error occurred
 */
export function useDocumentOnce<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>(
    reference: DocumentReference<AppModelType, DbModelType> | undefined | null,
    options?: UseDocumentOnceOptions,
): UseDocumentOnceResult<AppModelType> {
    const { source = "default" } = options ?? {};

    const getData = useCallback(
        (stableRef: DocumentReference<AppModelType, DbModelType>) => getDocFromSource(stableRef, source),
        [source],
    );

    return useGet(reference ?? undefined, getData, isDocRefEqual);
}
