/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
import { useEffect, useMemo } from "react";
import { ValueHookResult } from "../common/types.js";
import { use } from "./use.js";

/**
 * key: `Reference`
 * value: `WrappedPromise<Value | undefined>`
 */
// @ts-expect-error Property is missing on `globalThis`
const promiseCache: Map<unknown, Promise<unknown>> = globalThis._rfh_promises ?? new Map<unknown, Promise<unknown>>();

// @ts-expect-error Property is missing on `globalThis`
if (!globalThis._rfh_promises) {
    // @ts-expect-error Property is missing on `globalThis`
    globalThis._rfh_promises = promiseCache;
}

const undefinedPromise = Promise.resolve(undefined);

/**
 * @internal
 */
export function useOnceSuspense<Value, Error, Reference>(
    stableRef: Reference | undefined,
    getData: (ref: Reference) => Promise<Value>,
    isEqual: (a: Reference | undefined, b: Reference | undefined) => boolean,
    enabled = true,
): ValueHookResult<Value, Error> | undefined {
    const stablePromise = useMemo(() => {
        if (!enabled) {
            return undefinedPromise;
        }

        if (stableRef === undefined) {
            return undefinedPromise;
        }

        for (const [ref, promise] of promiseCache) {
            if (isEqual(ref as Reference, stableRef)) {
                return promise;
            }
        }

        const promise = getData(stableRef);
        promiseCache.set(stableRef, promise);
        return promise;

        // TODO: add options as dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stableRef]);

    const data = use(stablePromise);

    // Clean cache once the component mounted (aka, the promise is resolved)
    useEffect(() => {
        promiseCache.delete(stableRef);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!enabled) {
        return undefined;
    }

    return [data, false, undefined] as ValueHookResult<Value, Error>;
}
