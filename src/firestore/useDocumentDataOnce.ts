import { DocumentData, DocumentReference, FirestoreError, SnapshotOptions } from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types.js";
import { useGet } from "../internal/useGet.js";
import { getDocFromSource, isDocRefEqual } from "./internal.js";
import type { Source } from "./types.js";

export type UseDocumentDataOnceResult<AppModelType = DocumentData> = ValueHookResult<AppModelType, FirestoreError>;

/**
 * Options to configure how the document is fetched
 */
export interface UseDocumentDataOnceOptions {
    source?: Source | undefined;
    snapshotOptions?: SnapshotOptions | undefined;
}

/**
 * Returns the data of a Firestore DocumentReference
 * @template AppModelType Shape of the data after it was converted from firestore
 * @template DbModelType Shape of the data in firestore
 * @param reference Firestore DocumentReference that will be subscribed to
 * @param options  Options to configure how the document is fetched
 * @returns Document data, loading state, and error
 * - value: Document data; `undefined` if document does not exist, is currently being fetched, or an error occurred
 * - loading: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
 * - error: `undefined` if no error occurred
 */
export function useDocumentDataOnce<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>(
    reference: DocumentReference<AppModelType, DbModelType> | undefined | null,
    options?: UseDocumentDataOnceOptions | undefined,
): UseDocumentDataOnceResult<AppModelType> {
    const { source = "default", snapshotOptions } = options ?? {};
    const { serverTimestamps = "none" } = snapshotOptions ?? {};

    const getData = useCallback(
        async (stableRef: DocumentReference<AppModelType, DbModelType>) => {
            const snap = await getDocFromSource(stableRef, source);
            return snap.data({ serverTimestamps });
        },
        [serverTimestamps, source],
    );

    return useGet(reference ?? undefined, getData, isDocRefEqual);
}
