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

export type UseDocumentResult<AppModelType = DocumentData> = ValueHookResult<DocumentSnapshot<AppModelType>, FirestoreError>;

/**
 * Options to configure the subscription
 */
export interface UseDocumentOptions {
    snapshotListenOptions?: SnapshotListenOptions;
}

/**
 * Returns and updates a DocumentSnapshot of a Firestore DocumentReference
 * @template AppModelType Shape of the data after it was converted from firestore
 * @template DbModelType Shape of the data in firestore
 * @param reference Firestore DocumentReference that will be subscribed to
 * @param options Options to configure the subscription
 * @returns Document snapshot, loading state, and error
 * - value: DocumentSnapshot; `undefined` if document does not exist, is currently being fetched, or an error occurred
 * - loading: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
 * - error: `undefined` if no error occurred
 */
export function useDocument<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>(
    reference: DocumentReference<AppModelType, DbModelType> | undefined | null,
    options?: UseDocumentOptions,
): UseDocumentResult<AppModelType> {
    const { snapshotListenOptions } = options ?? {};
    const { includeMetadataChanges } = snapshotListenOptions ?? {};

    const onChange: UseListenOnChange<
        DocumentSnapshot<AppModelType, DbModelType>,
        FirestoreError,
        DocumentReference<AppModelType, DbModelType>
    > = useCallback(
        (stableRef, next, error) =>
            onSnapshot(
                stableRef,
                { includeMetadataChanges },
                {
                    next,
                    error,
                },
            ),
        [includeMetadataChanges],
    );

    return useListen(reference ?? undefined, onChange, isDocRefEqual, LoadingState);
}
