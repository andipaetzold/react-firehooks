import { StorageReference } from "firebase/storage";

/**
 * @internal
 */
export function isStorageRefEqual(a: StorageReference | undefined, b: StorageReference | undefined): boolean {
    return a?.fullPath === b?.fullPath;
}
