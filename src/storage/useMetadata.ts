import { FullMetadata, getMetadata, StorageError, StorageReference } from "firebase/storage";
import type { ValueHookResult } from "../common/index.js";
import { useOnce } from "../internal/useOnce.js";
import { isStorageRefEqual } from "./internal.js";

export type UseMetadataResult = ValueHookResult<FullMetadata, StorageError>;

/**
 * Returns the metadata of a Google Cloud Storage object
 *
 * @param {StorageReference | undefined | null} reference Reference to a Google Cloud Storage object
 * @returns {UseMetadataResult} Metadata, loading state, and error
 * * value: Metadata; `undefined` if metadata is currently being fetched, or an error occurred
 * * loading: `true` while fetching the metadata; `false` if the metadata was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useMetadata(reference: StorageReference | undefined | null): UseMetadataResult {
    return useOnce(reference ?? undefined, getMetadata, isStorageRefEqual);
}
