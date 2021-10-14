import { DocumentReference, getDoc, getDocFromCache, getDocFromServer } from "firebase/firestore";
import { getDocFromSource } from "./internal";

jest.mock("firebase/firestore", () => {
    const actual = jest.requireActual("firebase/firestore");
    return {
        ...actual,
        getDoc: jest.fn(actual.getDoc),
        getDocFromServer: jest.fn(actual.getDocFromServer),
        getDocFromCache: jest.fn(actual.getDocFromCache),
    };
});

const getDocMock = getDoc as jest.Mock<ReturnType<typeof getDoc>, Parameters<typeof getDoc>>;
const getDocFromServerMock = getDocFromServer as jest.Mock<
    ReturnType<typeof getDocFromServer>,
    Parameters<typeof getDocFromServer>
>;
const getDocFromCacheMock = getDocFromCache as jest.Mock<
    ReturnType<typeof getDocFromCache>,
    Parameters<typeof getDocFromCache>
>;

beforeEach(() => {
    jest.resetAllMocks();
});

describe("getDocFromSource", () => {
    it("uses default getDoc method", async () => {
        const reference = Symbol("Snapshot") as unknown as DocumentReference;

        await getDocFromSource(reference, "default");

        expect(getDocMock).toHaveBeenCalledWith(reference);
    });

    it("uses cache getDoc method", async () => {
        const reference = Symbol("Snapshot") as unknown as DocumentReference;

        await getDocFromSource(reference, "cache");

        expect(getDocFromCacheMock).toHaveBeenCalledWith(reference);
    });

    it("uses server getDoc method", async () => {
        const reference = Symbol("Snapshot") as unknown as DocumentReference;

        await getDocFromSource(reference, "server");

        expect(getDocFromServerMock).toHaveBeenCalledWith(reference);
    });
});
