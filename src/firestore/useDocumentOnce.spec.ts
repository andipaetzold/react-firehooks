import { DocumentReference, DocumentSnapshot } from "@firebase/firestore";
import { renderHook } from "@testing-library/react-hooks";
import { getDocFromSource } from "./internal";
import { useDocumentOnce } from "./useDocumentOnce";

jest.mock("firebase/firestore", () => {
    const actual = jest.requireActual("firebase/firestore");

    return {
        ...actual,
        refEqual: (a: DocumentReference<Symbol>, b: DocumentReference<Symbol>) =>
            [a, b].every((x) => [refA1, refA2].includes(x)) || [a, b].every((x) => [refB1, refB2].includes(x)),
    };
});

jest.mock("./internal", () => {
    const actual = jest.requireActual("./internal");
    return {
        ...actual,
        getDocFromSource: jest.fn(actual.getDocFromSource),
    };
});

const getDocFromSourceMock = getDocFromSource as jest.Mock<
    ReturnType<typeof getDocFromSource>,
    Parameters<typeof getDocFromSource>
>;

const snap1 = Symbol("Snap 1") as unknown as DocumentSnapshot;
const snap2 = Symbol("Snap 2") as unknown as DocumentSnapshot;
const error = Symbol("Error");

const refA1 = Symbol("DocRef A1") as unknown as DocumentReference<Symbol>;
const refA2 = Symbol("DocRef A2") as unknown as DocumentReference<Symbol>;

const refB1 = Symbol("DocRef B1") as unknown as DocumentReference<Symbol>;
const refB2 = Symbol("DocRef B2") as unknown as DocumentReference<Symbol>;

beforeEach(() => {
    jest.resetAllMocks();
});

describe("initial state", () => {
    it("should return loading=false for undefined ref", () => {
        const { result } = renderHook(() => useDocumentOnce(undefined));

        expect(result.current).toStrictEqual([undefined, false, undefined]);
    });

    it("should return loading=true for defined ref", () => {
        getDocFromSourceMock.mockImplementation(() => newPromise<DocumentSnapshot>().promise);
        const { result } = renderHook(() => useDocumentOnce(refA1));
        expect(result.current).toStrictEqual([undefined, true, undefined]);
    });
});

describe("initial load", () => {
    it("should return success result", async () => {
        const { promise, resolve } = newPromise<DocumentSnapshot>();
        getDocFromSourceMock.mockReturnValue(promise);

        const { result, waitForNextUpdate } = renderHook(() => useDocumentOnce<Symbol>(refA1));
        expect(result.current).toStrictEqual([undefined, true, undefined]);
        resolve(snap1);
        await waitForNextUpdate();
        expect(result.current).toStrictEqual([snap1, false, undefined]);
    });

    it("should return error result", async () => {
        const { promise, reject } = newPromise<DocumentSnapshot>();
        getDocFromSourceMock.mockReturnValue(promise);

        const { result, waitForNextUpdate } = renderHook(() => useDocumentOnce<Symbol>(refA1));
        expect(result.current).toStrictEqual([undefined, true, undefined]);
        reject(error);
        await waitForNextUpdate();
        expect(result.current).toStrictEqual([undefined, false, error]);
    });
});

describe("when ref changes", () => {
    describe("to equal ref", () => {
        it("should not update success result", async () => {
            getDocFromSourceMock.mockImplementationOnce(() => new Promise((resolve) => resolve(snap1)));

            const { result, waitForNextUpdate, rerender } = renderHook(({ ref }) => useDocumentOnce<Symbol>(ref), {
                initialProps: { ref: refA1 },
            });

            expect(result.current).toStrictEqual([undefined, true, undefined]);
            await waitForNextUpdate();
            expect(result.current).toStrictEqual([snap1, false, undefined]);
            expect(getDocFromSourceMock).toHaveBeenCalledTimes(1);

            rerender({ ref: refA2 });
            expect(result.current).toStrictEqual([snap1, false, undefined]);
            expect(getDocFromSourceMock).toHaveBeenCalledTimes(1);
        });

        it("should not update error result", async () => {
            getDocFromSourceMock.mockImplementationOnce(() => new Promise((_resolve, reject) => reject(error)));

            const { result, waitForNextUpdate, rerender } = renderHook(({ ref }) => useDocumentOnce<Symbol>(ref), {
                initialProps: { ref: refA1 },
            });

            expect(result.current).toStrictEqual([undefined, true, undefined]);
            await waitForNextUpdate();
            expect(result.current).toStrictEqual([undefined, false, error]);
            expect(getDocFromSourceMock).toHaveBeenCalledTimes(1);

            rerender({ ref: refA2 });
            expect(result.current).toStrictEqual([undefined, false, error]);
            expect(getDocFromSourceMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("to unequal ref", () => {
        it("should update success result", async () => {
            getDocFromSourceMock
                .mockImplementationOnce(() => new Promise((resolve) => resolve(snap1)))
                .mockImplementationOnce(() => new Promise((resolve) => resolve(snap2)));

            const { result, waitForNextUpdate, rerender } = renderHook(({ ref }) => useDocumentOnce<Symbol>(ref), {
                initialProps: { ref: refA1 },
            });

            expect(result.current).toStrictEqual([undefined, true, undefined]);
            expect(getDocFromSourceMock).toHaveBeenCalledTimes(1);
            await waitForNextUpdate();
            expect(result.current).toStrictEqual([snap1, false, undefined]);

            rerender({ ref: refB1 });
            expect(getDocFromSourceMock).toHaveBeenCalledTimes(2);
            await waitForNextUpdate();
            expect(result.current).toStrictEqual([snap2, false, undefined]);
        });

        it("should update error result", async () => {
            getDocFromSourceMock
                .mockImplementationOnce(() => new Promise((_resolve, reject) => reject(error)))
                .mockImplementationOnce(() => new Promise((resolve) => resolve(snap2)));

            const { result, waitForNextUpdate, rerender } = renderHook(({ ref }) => useDocumentOnce<Symbol>(ref), {
                initialProps: { ref: refA1 },
            });

            expect(result.current).toStrictEqual([undefined, true, undefined]);
            expect(getDocFromSourceMock).toHaveBeenCalledTimes(1);
            await waitForNextUpdate();
            expect(result.current).toStrictEqual([undefined, false, error]);

            rerender({ ref: refB1 });
            expect(result.current).toStrictEqual([undefined, true, undefined]);
            expect(getDocFromSourceMock).toHaveBeenCalledTimes(2);
            await waitForNextUpdate();
            expect(result.current).toStrictEqual([snap2, false, undefined]);
        });
    });
});

function newPromise<T>() {
    let resolve: (value: T) => void;
    let reject: (error: unknown) => void;
    const promise = new Promise<T>((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    // @ts-ignore
    return { promise, resolve, reject };
}
