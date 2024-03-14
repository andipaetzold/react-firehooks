import {
    DocumentData,
    DocumentReference,
    FirestoreError,
    onSnapshot,
    SnapshotListenOptions,
    SnapshotOptions,
} from "firebase/firestore";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/types.js";
import { useListen, UseListenOnChange } from "../internal/useListen.js";
import { LoadingState } from "../internal/useLoadingValue.js";
import { isDocRefEqual, SnapshotListenOptionsInternal } from "./internal.js";

export type UseDocumentDataResult<AppModelType = DocumentData> = ValueHookResult<AppModelType, FirestoreError>;

/**
 * Options to configure the subscription
 */
export interface UseDocumentDataOptions<AppModelType = DocumentData> {
    snapshotListenOptions?: SnapshotListenOptions | undefined;
    snapshotOptions?: SnapshotOptions | undefined;
    initialValue?: AppModelType | undefined;
}

/**
 * Returns and updates the data of a Firestore DocumentReference
 * @template AppModelType Shape of the data after it was converted from firestore
 * @template DbModelType Shape of the data in firestore
 * @param reference Firestore DocumentReference that will be subscribed to
 * @param options Options to configure the subscription
 * `initialValue`: Value that is returned while the document is being fetched.
 * @returns Document data, loading state, and error
 * - value: Document data; `undefined` if document does not exist, is currently being fetched, or an error occurred
 * - loading: `true` while fetching the document; `false` if the document was fetched successfully or an error occurred
 * - error: `undefined` if no error occurred
 */
export function useDocumentData<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>(
    reference: DocumentReference<AppModelType, DbModelType> | undefined | null,
    options?: UseDocumentDataOptions<AppModelType> | undefined,
): UseDocumentDataResult<AppModelType> {
    const { snapshotListenOptions, snapshotOptions } = options ?? {};
    const { includeMetadataChanges = false, source = "default" } = (snapshotListenOptions ??
        {}) as SnapshotListenOptionsInternal;
    const { serverTimestamps = "none" } = snapshotOptions ?? {};

    const onChange: UseListenOnChange<
        AppModelType,
        FirestoreError,
        DocumentReference<AppModelType, DbModelType>
    > = useCallback(
        (stableRef, next, error) =>
            onSnapshot(
                stableRef,
                {
                    includeMetadataChanges,
                    source,
                } as SnapshotListenOptions,
                {
                    next: (snap) => next(snap.data({ serverTimestamps })),
                    error,
                },
            ),
        [includeMetadataChanges, serverTimestamps, source],
    );

    return useListen(reference ?? undefined, onChange, isDocRefEqual, options?.initialValue ?? LoadingState);
}
