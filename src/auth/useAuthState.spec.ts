import { renderHook } from "@testing-library/react";
import { Auth, onAuthStateChanged, User } from "firebase/auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newSymbol } from "../__testfixtures__/index.js";
import { useAuthState } from "./useAuthState.js";

vi.mock("firebase/auth", () => ({
    onAuthStateChanged: vi.fn(),
}));

beforeEach(() => {
    vi.resetAllMocks();
});

describe("initial state", () => {
    it("should return currentUser when defined", () => {
        const currentUser = newSymbol<User>("Current User");
        const mockAuth = { currentUser } as Auth;

        vi.mocked(onAuthStateChanged).mockImplementation(() => () => {});

        const { result } = renderHook(() => useAuthState(mockAuth));
        expect(result.current).toStrictEqual([currentUser, false, undefined]);
    });

    it("should return undefined when currentUser is null", () => {
        const mockAuth = { currentUser: null } as Auth;

        vi.mocked(onAuthStateChanged).mockImplementation(() => () => {});

        const { result } = renderHook(() => useAuthState(mockAuth));
        expect(result.current).toStrictEqual([undefined, true, undefined]);
    });
});
