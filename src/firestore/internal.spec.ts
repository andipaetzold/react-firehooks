import {
    average,
    count,
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
import { getDocFromSource, getDocsFromSource, isAggregateSpecEqual, isDocRefEqual, isQueryEqual } from "./internal";

vi.mock("firebase/firestore", async () => {
    const mod = await vi.importActual<typeof import("firebase/firestore")>("firebase/firestore");

    return {
        ...mod,
        getDoc: vi.fn(),
        getDocFromServer: vi.fn(),
        getDocFromCache: vi.fn(),
        getDocs: vi.fn(),
        getDocsFromServer: vi.fn(),
        getDocsFromCache: vi.fn(),
        queryEqual: Object.is,
        refEqual: Object.is,
    };
});

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

describe("isDocRefEqual", () => {
    it("with undefined", () => {
        const ref = newSymbol<DocumentReference>("ref");
        expect(isDocRefEqual(undefined, undefined)).toBe(true);
        expect(isDocRefEqual(ref, undefined)).toBe(false);
        expect(isDocRefEqual(undefined, ref)).toBe(false);
    });

    it("with refs", () => {
        const refA = newSymbol<DocumentReference>("refA");
        const refB = newSymbol<DocumentReference>("refB");
        expect(isDocRefEqual(refA, refA)).toBe(true);
        expect(isDocRefEqual(refA, refB)).toBe(false);
    });
});

describe("isQueryEqual", () => {
    it("with undefined", () => {
        const query = newSymbol<Query>("query");
        expect(isQueryEqual(undefined, undefined)).toBe(true);
        expect(isQueryEqual(query, undefined)).toBe(false);
        expect(isQueryEqual(undefined, query)).toBe(false);
    });

    it("with refs", () => {
        const queryA = newSymbol<Query>("queryA");
        const queryB = newSymbol<Query>("queryB");
        expect(isQueryEqual(queryA, queryA)).toBe(true);
        expect(isQueryEqual(queryA, queryB)).toBe(false);
    });
});

describe("isAggregateSpecEqual", () => {
    it("different key count", () => {
        const spec1 = { count: count() };
        const spec2 = {};
        expect(isAggregateSpecEqual(spec1, spec2)).toBe(false);
    });

    it("different aggregations", () => {
        const spec1 = { value: count() };
        const spec2 = { value: average("abc") };
        expect(isAggregateSpecEqual(spec1, spec2)).toBe(false);
    });

    it("identical, single aggregate", () => {
        const spec1 = { count: count() };
        const spec2 = { count: count() };
        expect(isAggregateSpecEqual(spec1, spec2)).toBe(true);
    });

    it("identical, multiple aggregates", () => {
        const spec1 = { count: count(), avg: average("123") };
        const spec2 = { count: count(), avg: average("123") };
        expect(isAggregateSpecEqual(spec1, spec2)).toBe(true);
    });
});
