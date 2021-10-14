import { renderHook } from "@testing-library/react-hooks";
import { useDocumentDataOnce } from "./useDocumentDataOnce";

describe("initial state", () => {
    it("with undefined reference", () => {
        const { result } = renderHook(() => useDocumentDataOnce(undefined));

        expect(result.current).toStrictEqual([undefined, false, undefined]);
    });
});
