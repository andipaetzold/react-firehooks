import {
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    FirestoreError,
    onSnapshot,
    SnapshotListenOptions,
} from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types.js";
import { useListen, UseListenOnChange } from "../internal/useListen.js";
import { LoadingState } from "../internal/useLoadingValue.js";
import { isDocRefEqual } from "./internal.js";

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
 * @template Value Type of the document data
 * @param reference Firestore DocumentReference that will be subscribed to
 * @param options Options to configure the subscription
 * @returns Document snapshot, loading state, and error
 * value: DocumentSnapshot; `undefined` if document does not exist, is currently being fetched, or an error occurred
 * loading: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useDocument<Value extends DocumentData = DocumentData>(
    reference: DocumentReference<Value> | undefined | null,
    options?: UseDocumentOptions,
): UseDocumentResult<Value> {
    const { snapshotListenOptions = {} } = options ?? {};

    const onChange: UseListenOnChange<DocumentSnapshot<Value>, FirestoreError, DocumentReference<Value>> = useCallback(
        (stableRef, next, error) =>
            onSnapshot<Value>(stableRef, snapshotListenOptions, {
                next,
                error,
            }),
        // TODO: add options as dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return useListen(reference ?? undefined, onChange, isDocRefEqual, LoadingState);
}
