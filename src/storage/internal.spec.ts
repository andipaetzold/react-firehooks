import { StorageReference } from "@firebase/storage";
import { describe, expect, it } from "vitest";
import { isStorageRefEqual } from "./internal";

describe("isStorageRefEqual", () => {
    it("returns true for undefined reference", () => {
        expect(isStorageRefEqual(undefined, undefined)).toBe(true);
    });

    it("returns false for undefined and defined reference", () => {
        const ref = { fullPath: "path" } as StorageReference;

        expect(isStorageRefEqual(ref, undefined)).toBe(false);
        expect(isStorageRefEqual(undefined, ref)).toBe(false);
    });

    it("returns false for different paths", () => {
        const ref1 = { fullPath: "path1" } as StorageReference;
        const ref2 = { fullPath: "path2" } as StorageReference;

        expect(isStorageRefEqual(ref1, ref2)).toBe(false);
    });

    it("returns true for same paths", () => {
        const ref1 = { fullPath: "path" } as StorageReference;
        const ref2 = { fullPath: "path" } as StorageReference;

        expect(isStorageRefEqual(ref1, ref2)).toBe(true);
    });
});
