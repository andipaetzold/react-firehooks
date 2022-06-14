import { getStream, StorageError, StorageReference } from "firebase/storage";
import { useCallback } from "react";
import type { ValueHookResult } from "../common/index.js";
import { useOnce } from "../internal/useOnce.js";
import { isStorageRefEqual } from "./internal.js";

export type UseStreamResult = ValueHookResult<NodeJS.ReadableStream, StorageError>;

/**
 * Returns the data of a Google Cloud Storage object as a stream
 *
 * This hook is only available in Node
 *
 * @param {StorageReference | undefined | null} reference Reference to a Google Cloud Storage object
 * @param {?number} maxDownloadSizeBytes If set, the maximum allowed size in bytes to retrieve
 * @returns {UseStreamResult} Data, loading state, and error
 * * value: Object data as stream; `undefined` if data of the object is currently being downloaded, or an error occurred
 * * loading: `true` while downloading the data of the object; `false` if the data was downloaded successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useStream(reference: StorageReference | undefined | null, maxDownloadSizeBytes?: number): UseStreamResult {
    const fetchBlob = useCallback(
        async (ref: StorageReference) => getStream(ref, maxDownloadSizeBytes),
        [maxDownloadSizeBytes]
    );

    return useOnce(reference ?? undefined, fetchBlob, isStorageRefEqual);
}
