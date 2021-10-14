import { Auth, AuthError, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common";
import { useLoadingValue } from "../util/useLoadingValue";

export type UseAuthStateResult = ValueHookResult<User | null, AuthError>;

export function useAuthState(auth: Auth): UseAuthStateResult {
    const { error, loading, setError, setValue, value } = useLoadingValue<User | null, AuthError>(auth.currentUser);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            setValue,
            // We assume this is always a AuthError
            (e) => setError(e as AuthError)
        );

        return () => {
            unsubscribe();
        };
    }, [auth]);

    return useMemo(() => [value, loading, error], [value, loading, error]);
}
