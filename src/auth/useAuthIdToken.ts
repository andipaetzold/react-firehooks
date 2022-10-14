import { Auth, AuthError, getIdToken, onIdTokenChanged } from "firebase/auth";
import { useCallback } from "react";
import { ValueHookResult } from "../common/index.js";
import { useListen, UseListenOnChange } from "../internal/useListen.js";
import { LoadingState } from "../internal/useLoadingValue.js";

export type UseAuthIdTokenResult = ValueHookResult<string | null, AuthError>;

/**
 * Returns and updates the JWT of the currently authenticated user
 *
 * @param {Auth} auth Firebase Auth instance
 * @returns {UseAuthIdTokenResult} JWT, loading state, and error
 * * value: JWT; `undefined` if JWT is currently being fetched, or an error occurred
 * * loading: `true` while fetching JWT; `false` if the JWT was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useAuthIdToken(auth: Auth): UseAuthIdTokenResult {
    const onChange: UseListenOnChange<string | null, AuthError, Auth> = useCallback(
        (stableAuth, next, error) =>
            onIdTokenChanged(stableAuth, async (user) => {
                if (user) {
                    try {
                        // Can also be accessed via `user.accessToken`, but that's not officially documented
                        const idToken = await getIdToken(user);
                        next(idToken);
                    } catch (e) {
                        error(e as AuthError);
                    }
                } else {
                    next(null);
                }
            }),
        []
    );

    return useListen(auth, onChange, () => true, LoadingState);
}
