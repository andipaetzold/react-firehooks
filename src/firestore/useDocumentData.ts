import {
    DocumentData,
    DocumentReference,
    FirestoreError,
    onSnapshot,
    SnapshotListenOptions,
    SnapshotOptions,
} from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types";
import { useListen, UseListenOnChange } from "../internal/useListen";
import { LoadingState } from "../internal/useLoadingValue";
import { isDocRefEqual } from "./internal";

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
 * @template Value Type of the document data
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

    const onChange: UseListenOnChange<Value, FirestoreError, DocumentReference<Value>> = useCallback(
        (stableRef, next, error) =>
            onSnapshot<Value>(stableRef, snapshotListenOptions, {
                next: (snap) => next(snap.data(snapshotOptions)),
                error,
            }),
        []
    );

    return useListen(reference ?? undefined, onChange, isDocRefEqual, LoadingState);
}
