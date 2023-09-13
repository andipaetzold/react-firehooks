import { getBytes, StorageError, StorageReference } from "firebase/storage";
import { useCallback } from "react";
import { ValueHookResult } from "../common/index.js";
import { useOnce } from "../internal/useOnce.js";
import { isStorageRefEqual } from "./internal.js";

export type UseBytesResult = ValueHookResult<ArrayBuffer, StorageError>;

/**
 * Options to configure how the object is fetched
 */
export interface UseBytesOptions {
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
 * Returns the data of a Google Cloud Storage object
 * @param reference Reference to a Google Cloud Storage object
 * @param [options] Options to configure how the object is fetched
 * @returns Data, loading state, and error
 * value: Object data; `undefined` if data of the object is currently being downloaded, or an error occurred
 * loading: `true` while downloading the data of the object; `false` if the data was downloaded successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useBytes(reference: StorageReference | undefined | null, options?: UseBytesOptions): UseBytesResult;
/**
 * Returns the data of a Google Cloud Storage object
 * @param reference Reference to a Google Cloud Storage object
 * @param maxDownloadSizeBytes The maximum allowed size in bytes to retrieve
 * @returns Data, loading state, and error
 * value: Object data; `undefined` if data of the object is currently being downloaded, or an error occurred
 * loading: `true` while downloading the data of the object; `false` if the data was downloaded successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useBytes(reference: StorageReference | undefined | null, maxDownloadSizeBytes?: number): UseBytesResult;
/**
 * Returns the data of a Google Cloud Storage object
 * @param reference Reference to a Google Cloud Storage object
 * @param optionsOrMaxDownloadSizeBytes Options to configure how the object is fetched, or the maximum allowed size in bytes to retrieve
 * @returns Data, loading state, and error
 * value: Object data; `undefined` if data of the object is currently being downloaded, or an error occurred
 * loading: `true` while downloading the data of the object; `false` if the data was downloaded successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useBytes(
    reference: StorageReference | undefined | null,
    optionsOrMaxDownloadSizeBytes?: UseBytesOptions | number,
): UseBytesResult {
    const { maxDownloadSizeBytes, suspense = false } =
        typeof optionsOrMaxDownloadSizeBytes === "number"
            ? { maxDownloadSizeBytes: optionsOrMaxDownloadSizeBytes }
            : optionsOrMaxDownloadSizeBytes ?? {};

    const fetchBytes = useCallback(
        async (ref: StorageReference) => getBytes(ref, maxDownloadSizeBytes),
        [maxDownloadSizeBytes],
    );

    return useOnce(reference ?? undefined, fetchBytes, isStorageRefEqual, suspense);
}
