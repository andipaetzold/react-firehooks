import { StorageReference } from "@firebase/storage";
import { useStableValue } from "../util/useStableValue";

/**
 * @internal
 */
function isStorageRefEqual(a: StorageReference | undefined, b: StorageReference | undefined): boolean {
    return a?.fullPath === b?.fullPath;
}

/**
 * @internal
 */
export function useStableStorageRef(query: StorageReference | undefined): StorageReference | undefined {
    return useStableValue(query, isStorageRefEqual);
}
