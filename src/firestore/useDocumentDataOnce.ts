import { DocumentData, DocumentReference, FirestoreError, SnapshotOptions } from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types.js";
import { useOnce } from "../internal/useOnce.js";
import { getDocFromSource, isDocRefEqual } from "./internal.js";
import type { Source } from "./types.js";

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
 * @template Value Type of the document data
 * @param reference Firestore DocumentReference that will be subscribed to
 * @param options  Options to configure how the document is fetched
 * @returns Document data, loading state, and error
 * value: Document data; `undefined` if document does not exist, is currently being fetched, or an error occurred
 * loading: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useDocumentDataOnce<Value extends DocumentData = DocumentData>(
    reference: DocumentReference<Value> | undefined | null,
    options?: UseDocumentDataOnceOptions,
): UseDocumentDataOnceResult<Value> {
    const { source = "default", snapshotOptions } = options ?? {};

    const getData = useCallback(async (stableRef: DocumentReference<Value>) => {
        const snap = await getDocFromSource(stableRef, source);
        return snap.data(snapshotOptions);
        // TODO: add options as dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return useOnce(reference ?? undefined, getData, isDocRefEqual);
}
