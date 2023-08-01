import { Messaging, getToken, GetTokenOptions } from "firebase/messaging";
import { ValueHookResult } from "../common/index.js";
import { useOnce } from "../internal/useOnce.js";

export type UseMessagingTokenResult = ValueHookResult<string, Error>;

/**
 * Options to configure how the token will be fetched
 */
export interface UseMessagingTokenOptions {
    getTokenOptions?: GetTokenOptions;
}

/**
 * Returns the messaging token. The token never updates.
 *
 * @param {Messaging} messaging Firebase Messaging instance
 * @param {UseMessagingTokenOptions} options Options to configure how the token will be fetched
 * @returns {UseMessagingTokenResult} Token, loading state, and error
 * * value: Messaging token; `undefined` if token is currently being fetched, or an error occurred
 * * loading: `true` while fetching the token; `false` if the token was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useMessagingToken(messaging: Messaging, options?: UseMessagingTokenOptions): UseMessagingTokenResult {
    return useOnce(
        messaging,
        (m) => getToken(m, options?.getTokenOptions),
        () => true,
    );
}
