import {
    DocumentReference,
    getDoc,
    getDocFromCache,
    getDocFromServer,
    getDocs,
    getDocsFromCache,
    getDocsFromServer,
    Query,
} from "firebase/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newSymbol } from "../__testfixtures__";
import { getDocFromSource, getDocsFromSource } from "./internal";

vi.mock("firebase/firestore", () => ({
    getDoc: vi.fn(),
    getDocFromServer: vi.fn(),
    getDocFromCache: vi.fn(),
    getDocs: vi.fn(),
    getDocsFromServer: vi.fn(),
    getDocsFromCache: vi.fn(),
}));

beforeEach(() => {
    vi.resetAllMocks();
});

describe("getDocFromSource", () => {
    it("uses default getDoc method", async () => {
        const reference = newSymbol<DocumentReference>("Reference");

        await getDocFromSource(reference, "default");

        expect(vi.mocked(getDoc)).toHaveBeenCalledWith(reference);
    });

    it("uses cache getDoc method", async () => {
        const reference = newSymbol<DocumentReference>("Reference");

        await getDocFromSource(reference, "cache");

        expect(vi.mocked(getDocFromCache)).toHaveBeenCalledWith(reference);
    });

    it("uses server getDoc method", async () => {
        const reference = newSymbol<DocumentReference>("Reference");

        await getDocFromSource(reference, "server");

        expect(vi.mocked(getDocFromServer)).toHaveBeenCalledWith(reference);
    });
});

describe("getDocsFromSource", () => {
    it("uses default getDocs method", async () => {
        const query = newSymbol<Query>("Query");

        await getDocsFromSource(query, "default");

        expect(vi.mocked(getDocs)).toHaveBeenCalledWith(query);
    });

    it("uses cache getDocs method", async () => {
        const query = newSymbol<Query>("Query");

        await getDocsFromSource(query, "cache");

        expect(vi.mocked(getDocsFromCache)).toHaveBeenCalledWith(query);
    });

    it("uses server getDocs method", async () => {
        const query = newSymbol<Query>("Query");

        await getDocsFromSource(query, "server");

        expect(vi.mocked(getDocsFromServer)).toHaveBeenCalledWith(query);
    });
});
