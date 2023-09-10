import { FullMetadata, getMetadata, StorageError, StorageReference } from "firebase/storage";
import type { ValueHookResult } from "../common/index.js";
import { useOnce } from "../internal/useOnce.js";
import { isStorageRefEqual } from "./internal.js";

export type UseMetadataResult = ValueHookResult<FullMetadata, StorageError>;

/**
 * Options to configure how metadata is fetched
 */
export interface UseMetadataOptions {
    /**
     * @default false
     */
    suspense?: boolean;
}

/**
 * Returns the metadata of a Google Cloud Storage object
 *
 * @param {StorageReference | undefined | null} reference Reference to a Google Cloud Storage object
 * @param {?UseMetadataOptions} [options] Options to configure how metadata is fetched
 * @returns {UseMetadataResult} Metadata, loading state, and error
 * * value: Metadata; `undefined` if metadata is currently being fetched, or an error occurred
 * * loading: `true` while fetching the metadata; `false` if the metadata was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useMetadata(
    reference: StorageReference | undefined | null,
    options?: UseMetadataOptions,
): UseMetadataResult {
    const { suspense = false } = options ?? {};
    return useOnce(reference ?? undefined, getMetadata, isStorageRefEqual, suspense);
}
