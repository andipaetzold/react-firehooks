import { Auth, AuthError, getIdTokenResult, IdTokenResult, onIdTokenChanged } from "firebase/auth";
import { ValueHookResult } from "../common/index.js";
import { useListen, UseListenOnChange } from "../internal/useListen.js";
import { LoadingState } from "../internal/useLoadingValue.js";

export type UseAuthIdTokenResultResult = ValueHookResult<IdTokenResult | null, AuthError>;

const onChange: UseListenOnChange<IdTokenResult | null, AuthError, Auth> = (stableAuth, next, error) =>
    onIdTokenChanged(stableAuth, async (user) => {
        if (user) {
            try {
                // Can also be accessed via `user.accessToken`, but that's not officially documented
                const idTokenResult = await getIdTokenResult(user);
                next(idTokenResult);
            } catch (e) {
                error(e as AuthError);
            }
        } else {
            next(null);
        }
    });

/**
 * Returns and updates the deserialized JWT of the currently authenticated user
 * @param auth Firebase Auth instance
 * @returns Deserialized JWT, loading state, and error
 * value: Deserialized JWT; `undefined` if the JWT is currently being fetched, or an error occurred
 * loading: `true` while fetching JWT; `false` if the JWT was fetched successfully or an error occurred
 * error: `undefined` if no error occurred
 */
export function useAuthIdTokenResult(auth: Auth): UseAuthIdTokenResultResult {
    return useListen(auth, onChange, () => true, LoadingState);
}
