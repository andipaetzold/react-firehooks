import { useMemo } from "react";
import { WrappedPromise, wrapPromise } from "./wrapPromise.js";
import { ValueHookResult } from "../common/types.js";

/**
 * key: `Reference`
 * value: `WrappedPromise<Value | undefined>`
 */
// @ts-expect-error Property is missing on `globalThis`
const wrappedPromises: Map<unknown, WrappedPromise<unknown>> = globalThis._firehookWrappedPromises ??
new Map<unknown, WrappedPromise<unknown>>();

// @ts-expect-error Property is missing on `globalThis`
if (!globalThis._firehookPromises) {
    // @ts-expect-error Property is missing on `globalThis`
    globalThis._firehookWrappedPromises = wrappedPromises;
}

const undefinedPromise = wrapPromise(Promise.resolve(undefined));

/**
 * @internal
 */
export function useOnceSuspense<Value, Error, Reference>(
    stableRef: Reference | undefined,
    getData: (ref: Reference) => Promise<Value>,
    isEqual: (a: Reference | undefined, b: Reference | undefined) => boolean,
    enabled = true,
): ValueHookResult<Value, Error> | undefined {
    const read = useMemo(() => {
        if (stableRef === undefined) {
            return undefinedPromise;
        }

        for (const [ref, promise] of wrappedPromises) {
            if (isEqual(ref as Reference, stableRef)) {
                return promise;
            }
        }

        const promise = getData(stableRef);
        const wrappedPromise = wrapPromise(promise);
        wrappedPromises.set(stableRef, wrappedPromise);
        return wrappedPromise;

        // TODO: add options as dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stableRef]);

    if (!enabled) {
        return undefined;
    }

    return [read(), false, undefined] as ValueHookResult<Value, Error>;
}
