import { getDownloadURL, StorageError, StorageReference } from "firebase/storage";
import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common";
import { useIsMounted } from "../util/useIsMounted";
import { useLoadingValue } from "../util/useLoadingValue";
import { useStableStorageRef } from "./internal";

export type UseDownloadURLResult = ValueHookResult<string, StorageError>;

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
