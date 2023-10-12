import { Auth, AuthError, onAuthStateChanged, User } from "firebase/auth";
import { ValueHookResult } from "../common/index.js";
import { useListen, UseListenOnChange } from "../internal/useListen.js";
import { LoadingState } from "../internal/useLoadingValue.js";

export type UseAuthStateResult = ValueHookResult<User | null, AuthError>;

const onChange: UseListenOnChange<User | null, AuthError, Auth> = (stableAuth, next, error) =>
    onAuthStateChanged(stableAuth, next, (e) => error(e as AuthError));

/**
 * Returns and updates the currently authenticated user
 * @param auth Firebase Auth instance
 * @returns User, loading state, and error
 * value: User; `undefined` if user is currently being fetched, or an error occurred
 * loading: `true` while fetching the user; `false` if the user was fetched successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useAuthState(auth: Auth): UseAuthStateResult {
    return useListen(auth, onChange, () => true, auth.currentUser ? auth.currentUser : LoadingState);
}
