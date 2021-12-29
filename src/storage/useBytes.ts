import type { StorageError, StorageReference } from "firebase/storage";
import { useCallback } from "react";
import { ValueHookResult } from "../common";
import { useOnce } from "../internal/useOnce";
import { isStorageRefEqual } from "./internal";

export type UseBytesResult = ValueHookResult<ArrayBuffer, StorageError>;

/**
 * Returns the data of a Google Cloud Storage object
 *
 * Requires firebase v9.5.0 or later
 *
 * @param {StorageReference | undefined | null} reference Reference to a Google Cloud Storage object
 * @param {?number} maxDownloadSizeBytes If set, the maximum allowed size in bytes to retrieve
 * @returns {UseBytesResult} Data, loading state, and error
 * * value: Object data; `undefined` if data of the object is currently being downloaded, or an error occurred
 * * loading: `true` while downloading the data of the object; `false` if the data was downloaded successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useBytes(reference: StorageReference | undefined | null, maxDownloadSizeBytes?: number): UseBytesResult {
    const fetchBytes = useCallback(
        async (ref: StorageReference) => {
            // TODO: change to regular import in react-firehooks v2
            const firebaseStorage = await require("firebase/storage");
            if ("getBytes" in firebaseStorage) {
                return await firebaseStorage.getBytes(ref, maxDownloadSizeBytes);
            } else {
                throw new Error("`useBytes` requires firebase v9.5.0 or later");
            }
        },
        [maxDownloadSizeBytes]
    );

    return useOnce(reference ?? undefined, fetchBytes, isStorageRefEqual);
}
