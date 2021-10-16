import { getDownloadURL, StorageError, StorageReference } from "firebase/storage";
import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common";
import { useIsMounted } from "../internal/useIsMounted";
import { useLoadingValue } from "../internal/useLoadingValue";
import { useStableStorageRef } from "./internal";

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
    const isMounted = useIsMounted();
    const { value, setValue, loading, setLoading, error, setError } = useLoadingValue<string, StorageError>();

    const stableStorageRef = useStableStorageRef(reference ?? undefined);

    useEffect(() => {
        (async () => {
            if (stableStorageRef === undefined) {
                setValue();
            } else {
                setLoading();

                try {
                    const url = await getDownloadURL(stableStorageRef);

                    if (!isMounted.current) {
                        return;
                    }

                    setValue(url);
                } catch (e) {
                    if (!isMounted.current) {
                        return;
                    }

                    // We assume this is always a StorageError
                    setError(e as StorageError);
                }
            }
        })();
    }, [stableStorageRef]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
