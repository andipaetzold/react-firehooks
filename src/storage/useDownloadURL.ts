import { getDownloadURL, StorageError, StorageReference } from "firebase/storage";
import { useCallback } from "react";
import { ValueHookResult } from "../common";
import { useOnce } from "../internal/useOnce";
import { isStorageRefEqual } from "./internal";

export type UseDownloadURLResult = ValueHookResult<string, StorageError>;

/**
 * Returns the download URL of a Google Cloud Storage object
 *
 * @param {StorageReference | undefined | null} reference Reference to a Google Cloud Storage object
 * @returns {UseDownloadURLResult} Download URL, loading state, and error
 * * value: Download URL; `undefined` if download URL is currently being fetched, or an error occurred
 * * loading: `true` while fetching the download URL; `false` if the download URL was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useDownloadURL(reference: StorageReference | undefined | null): UseDownloadURLResult {
    const getData = useCallback((stableRef: StorageReference) => getDownloadURL(stableRef), []);
    return useOnce(reference ?? undefined, getData, isStorageRefEqual);
}
