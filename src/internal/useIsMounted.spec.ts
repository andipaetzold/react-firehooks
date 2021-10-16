import { renderHook } from "@testing-library/react-hooks";
import { useIsMounted } from "./useIsMounted";

it("should return `true` on first render", () => {
    const { result } = renderHook(() => useIsMounted());

    expect(result.current.current).toBe(true);
});

it("should return `true` after rerender", () => {
    const { result, rerender } = renderHook(() => useIsMounted());

    rerender();

    expect(result.current.current).toBe(true);
});

it("should return `false` after unmount", () => {
    const { result, unmount } = renderHook(() => useIsMounted());

    unmount();

    expect(result.current.current).toBe(false);
});
