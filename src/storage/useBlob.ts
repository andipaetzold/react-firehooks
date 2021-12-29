import { StorageError, StorageReference } from "firebase/storage";
import { useCallback } from "react";
import { ValueHookResult } from "../common";
import { useOnce } from "../internal/useOnce";
import { isStorageRefEqual } from "./internal";

export type UseBlobResult = ValueHookResult<Blob, StorageError>;

/**
 * Returns the data of a Google Cloud Storage object as a Blob
 *
 * Requires firebase v9.5.0 or later. This hook is not available in Node.
 *
 * @param {StorageReference | undefined | null} reference Reference to a Google Cloud Storage object
 * @param {?number} maxDownloadSizeBytes If set, the maximum allowed size in bytes to retrieve
 * @returns {UseBlobResult} Data, loading state, and error
 * * value: Object data as a Blob; `undefined` if data of the object is currently being downloaded, or an error occurred
 * * loading: `true` while downloading the data of the object; `false` if the data was downloaded successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useBlob(reference: StorageReference | undefined | null, maxDownloadSizeBytes?: number): UseBlobResult {
    const fetchBlob = useCallback(
        async (ref: StorageReference) => {
            // TODO: change to regular import in react-firehooks v2
            const firebaseStorage = await require("firebase/storage");
            if ("getBlob" in firebaseStorage) {
                return await firebaseStorage.getBlob(ref, maxDownloadSizeBytes);
            } else {
                throw new Error("`getBlob` requires firebase v9.5.0 or later");
            }
        },
        [maxDownloadSizeBytes]
    );

    return useOnce(reference ?? undefined, fetchBlob, isStorageRefEqual);
}
