import { getBytes, StorageError, StorageReference } from "firebase/storage";
import { useCallback } from "react";
import { ValueHookResult } from "../common/index.js";
import { useGet } from "../internal/useGet.js";
import { isStorageRefEqual } from "./internal.js";

export type UseBytesResult = ValueHookResult<ArrayBuffer, StorageError>;

/**
 * Returns the data of a Google Cloud Storage object
 * @param reference Reference to a Google Cloud Storage object
 * @param maxDownloadSizeBytes If set, the maximum allowed size in bytes to retrieve
 * @returns Data, loading state, and error
 * - value: Object data; `undefined` if data of the object is currently being downloaded, or an error occurred
 * - loading: `true` while downloading the data of the object; `false` if the data was downloaded successfully or an error occurred
 * - error: `undefined` if no error occurred
 */
export function useBytes(
    reference: StorageReference | undefined | null,
    maxDownloadSizeBytes?: number | undefined,
): UseBytesResult {
    const fetchBytes = useCallback(
        async (ref: StorageReference) => getBytes(ref, maxDownloadSizeBytes),
        [maxDownloadSizeBytes],
    );

    return useGet(reference ?? undefined, fetchBytes, isStorageRefEqual);
}
