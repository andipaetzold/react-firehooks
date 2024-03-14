import { renderHook } from "@testing-library/react";
import { expect, it, vi, describe, beforeEach } from "vitest";
import { useDocument } from "./useDocument";
import { newSymbol } from "../__testfixtures__";
import { DocumentReference, onSnapshot } from "firebase/firestore";

vi.mock("firebase/firestore", async () => ({
    ...(await vi.importActual("firebase/firestore")),
    onSnapshot: vi.fn().mockReturnValue(vi.fn()),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

const ref1 = newSymbol<DocumentReference>("Ref");

describe("when re-rendered", () => {
    it("with equal, but non-identical options object", () => {
        const options1 = { snapshotListenOptions: { includeMetadataChanges: false } };
        const options2 = { snapshotListenOptions: { includeMetadataChanges: false } };

        const { rerender } = renderHook(({ options }) => useDocument(ref1, options), {
            initialProps: { options: options1 },
        });

        expect(onSnapshot).toHaveBeenCalledTimes(1);
        rerender({ options: options2 });
        expect(onSnapshot).toHaveBeenCalledTimes(1);
    });

    it("with different options object", () => {
        const options1 = { snapshotListenOptions: { includeMetadataChanges: false } };
        const options2 = { snapshotListenOptions: { includeMetadataChanges: true } };

        const { rerender } = renderHook(({ options }) => useDocument(ref1, options), {
            initialProps: { options: options1 },
        });

        expect(onSnapshot).toHaveBeenCalledTimes(1);
        rerender({ options: options2 });
        expect(onSnapshot).toHaveBeenCalledTimes(2);
    });
});
