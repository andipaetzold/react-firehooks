import { AppCheck, AppCheckTokenResult, onTokenChanged } from "firebase/app-check";
import { useCallback } from "react";
import { ValueHookResult } from "../common/index.js";
import { useListen, UseListenOnChange } from "../internal/useListen.js";
import { LoadingState } from "../internal/useLoadingValue.js";

export type UseAppCheckToken = ValueHookResult<AppCheckTokenResult | null, Error>;

/**
 * Returns and updates the current App Check token
 *
 * @param {AppCheck} appCheck Firebase App Check instance
 * @returns {UseAppCheckToken} App Check token, loading state, and error
 * * value: App Check token; `undefined` if token is currently being fetched, or an error occurred
 * * loading: `true` while fetching the token; `false` if the token was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useAppCheckToken(appCheck: AppCheck): UseAppCheckToken {
    const onChange: UseListenOnChange<AppCheckTokenResult | null, Error, AppCheck> = useCallback(
        (stableAppCheck, next, error) => onTokenChanged(stableAppCheck, next, error),
        [],
    );

    return useListen(appCheck, onChange, () => true, LoadingState);
}
