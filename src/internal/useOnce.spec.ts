import { renderHook, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { newSymbol } from "../__testfixtures__";
import { useOnce } from "./useOnce";

const ref = newSymbol("Ref");

vi.mock("./useStableValue.js", () => ({
    useStableValue: (value: unknown) => value,
}));

vi.mock("./useOnceSuspense.js", () => ({
    useOnceSuspense: () => ["suspense-result", false, undefined] as const,
}));

vi.mock("./useOnceNoSuspense.js", () => ({
    useOnceNoSuspense: () => ["non-suspense-result", false, undefined] as const,
}));

it("uses suspense result", async () => {
    const { result } = renderHook(() => useOnce(ref, vi.fn(), () => true, true));

    await waitFor(() => expect(result.current).toStrictEqual(["suspense-result", false, undefined] as const));
});

it("uses non-suspense result", async () => {
    const { result } = renderHook(() => useOnce(ref, vi.fn(), () => true, false));

    await waitFor(() => expect(result.current).toStrictEqual(["non-suspense-result", false, undefined] as const));
});
