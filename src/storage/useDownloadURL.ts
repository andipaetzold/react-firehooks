import { getDownloadURL, StorageError, StorageReference } from "firebase/storage";
import { ValueHookResult } from "../common/index.js";
import { useOnce } from "../internal/useOnce.js";
import { isStorageRefEqual } from "./internal.js";

export type UseDownloadURLResult = ValueHookResult<string, StorageError>;

/**
 * Returns the download URL of a Google Cloud Storage object
 * @param reference Reference to a Google Cloud Storage object
 * @returns Download URL, loading state, and error
 * value: Download URL; `undefined` if download URL is currently being fetched, or an error occurred
 * loading: `true` while fetching the download URL; `false` if the download URL was fetched successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useDownloadURL(reference: StorageReference | undefined | null): UseDownloadURLResult {
    return useOnce(reference ?? undefined, getDownloadURL, isStorageRefEqual);
}
