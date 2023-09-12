import { getBlob, StorageError, StorageReference } from "firebase/storage";
import { useCallback } from "react";
import { ValueHookResult } from "../common/index.js";
import { useOnce } from "../internal/useOnce.js";
import { isStorageRefEqual } from "./internal.js";

export type UseBlobResult = ValueHookResult<Blob, StorageError>;

/**
 * Options to configure how the object is fetched
 */
export interface UseBlobOptions {
    /**
     * If set, the maximum allowed size in bytes to retrieve
     */
    maxDownloadSizeBytes?: number;

    /**
     * @default false
     */
    suspense?: boolean;
}

/**
 * Returns the data of a Google Cloud Storage object as a Blob
 *
 * This hook is not available in Node
 * @param reference Reference to a Google Cloud Storage object
 * @param [options] Options to configure how the object is fetched
 * @returns Data, loading state, and error
 * value: Object data as a Blob; `undefined` if data of the object is currently being downloaded, or an error occurred
 * loading: `true` while downloading the data of the object; `false` if the data was downloaded successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useBlob(reference: StorageReference | undefined | null, options?: UseBlobOptions): UseBlobResult;
/**
 * Returns the data of a Google Cloud Storage object as a Blob
 *
 * This hook is not available in Node
 * @param reference Reference to a Google Cloud Storage object
 * @param [maxDownloadSizeBytes] If set, the maximum allowed size in bytes to retrieve
 * @returns Data, loading state, and error
 * value: Object data as a Blob; `undefined` if data of the object is currently being downloaded, or an error occurred
 * loading: `true` while downloading the data of the object; `false` if the data was downloaded successfully or an error occurred
 * error: `undefined` if no error occurred
 * @deprecated Pass an `maxDownloadSizeBytes` as parameter of an object instead of directly.
 */
export function useBlob(reference: StorageReference | undefined | null, maxDownloadSizeBytes?: number): UseBlobResult;
/**
 * Returns the data of a Google Cloud Storage object as a Blob
 *
 * This hook is not available in Node
 * @param reference Reference to a Google Cloud Storage object
 * @param [optionsOrMaxDownloadSizeBytes] Options to configure how the object is fetched, or the maximum allowed size in bytes to retrieve
 * @returns Data, loading state, and error
 * value: Object data as a Blob; `undefined` if data of the object is currently being downloaded, or an error occurred
 * loading: `true` while downloading the data of the object; `false` if the data was downloaded successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useBlob(
    reference: StorageReference | undefined | null,
    optionsOrMaxDownloadSizeBytes?: UseBlobOptions | number,
): UseBlobResult {
    const { maxDownloadSizeBytes, suspense = false } =
        typeof optionsOrMaxDownloadSizeBytes === "number"
            ? { maxDownloadSizeBytes: optionsOrMaxDownloadSizeBytes }
            : optionsOrMaxDownloadSizeBytes ?? {};

    const fetchBlob = useCallback(
        async (ref: StorageReference) => getBlob(ref, maxDownloadSizeBytes),
        [maxDownloadSizeBytes],
    );

    return useOnce(reference ?? undefined, fetchBlob, isStorageRefEqual, suspense);
}
