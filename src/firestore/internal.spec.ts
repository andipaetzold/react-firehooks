import { DocumentReference, getDoc, getDocFromCache, getDocFromServer, getDocs, getDocsFromCache, getDocsFromServer, Query } from "firebase/firestore";
import { getDocFromSource, getDocsFromSource } from "./internal";

jest.mock("firebase/firestore", () => {
    const actual = jest.requireActual("firebase/firestore");
    return {
        ...actual,
        getDoc: jest.fn(actual.getDoc),
        getDocFromServer: jest.fn(actual.getDocFromServer),
        getDocFromCache: jest.fn(actual.getDocFromCache),
        getDocs: jest.fn(actual.getDocs),
        getDocsFromServer: jest.fn(actual.getDocsFromServer),
        getDocsFromCache: jest.fn(actual.getDocsFromCache),
    };
});

beforeEach(() => {
    jest.resetAllMocks();
});

describe("getDocFromSource", () => {
    const getDocMock = getDoc as jest.Mock<ReturnType<typeof getDoc>, Parameters<typeof getDoc>>;
    const getDocFromServerMock = getDocFromServer as jest.Mock<
        ReturnType<typeof getDocFromServer>,
        Parameters<typeof getDocFromServer>
    >;
    const getDocFromCacheMock = getDocFromCache as jest.Mock<
        ReturnType<typeof getDocFromCache>,
        Parameters<typeof getDocFromCache>
    >;

    it("uses default getDoc method", async () => {
        const reference = Symbol("Reference") as unknown as DocumentReference;

        await getDocFromSource(reference, "default");

        expect(getDocMock).toHaveBeenCalledWith(reference);
    });

    it("uses cache getDoc method", async () => {
        const reference = Symbol("Reference") as unknown as DocumentReference;

        await getDocFromSource(reference, "cache");

        expect(getDocFromCacheMock).toHaveBeenCalledWith(reference);
    });

    it("uses server getDoc method", async () => {
        const reference = Symbol("Reference") as unknown as DocumentReference;

        await getDocFromSource(reference, "server");

        expect(getDocFromServerMock).toHaveBeenCalledWith(reference);
    });
});


describe("getDocsFromSource", () => {
    const getDocsMock = getDocs as jest.Mock<ReturnType<typeof getDocs>, Parameters<typeof getDocs>>;
    const getDocsFromServerMock = getDocsFromServer as jest.Mock<
        ReturnType<typeof getDocsFromServer>,
        Parameters<typeof getDocsFromServer>
    >;
    const getDocsFromCacheMock = getDocsFromCache as jest.Mock<
        ReturnType<typeof getDocsFromCache>,
        Parameters<typeof getDocsFromCache>
    >;

    it("uses default getDocs method", async () => {
        const query = Symbol("Snapshot") as unknown as Query;

        await getDocsFromSource(query, "default");

        expect(getDocsMock).toHaveBeenCalledWith(query);
    });

    it("uses cache getDocs method", async () => {
        const query = Symbol("Snapshot") as unknown as Query;

        await getDocsFromSource(query, "cache");

        expect(getDocsFromCacheMock).toHaveBeenCalledWith(query);
    });

    it("uses server getDocs method", async () => {
        const query = Symbol("Snapshot") as unknown as Query;

        await getDocsFromSource(query, "server");

        expect(getDocsFromServerMock).toHaveBeenCalledWith(query);
    });
});