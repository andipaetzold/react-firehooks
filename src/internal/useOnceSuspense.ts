import { useMemo } from "react";
import { useStableValue } from "./useStableValue.js";
import { WrappedPromise, wrapPromise } from "./wrapPromise.js";

/**
 * key: `Reference`
 * value: `WrappedPromise<Value | undefined>`
 */
// @ts-expect-error Property is missing on `globalThis`
const wrappedPromises: Map<any, WrappedPromise<any>> = globalThis._firehookWrappedPromises ??
new Map<any, WrappedPromise<any>>();

// @ts-expect-error Property is missing on `globalThis`
if (!globalThis._firehookPromises) {
    // @ts-expect-error Property is missing on `globalThis`
    globalThis._firehookWrappedPromises = wrappedPromises;
}

const undefinedPromise = wrapPromise(Promise.resolve(undefined));

/**
 * @internal
 */
export function useOnceSuspense<Value, Reference>(
    reference: Reference | undefined,
    getData: (ref: Reference) => Promise<Value>,
    isEqual: (a: Reference | undefined, b: Reference | undefined) => boolean,
): Value | undefined {
    const stableRef = useStableValue(reference ?? undefined, isEqual);

    const read = useMemo(() => {
        if (stableRef === undefined) {
            return undefinedPromise;
        }

        for (const [ref, promise] of wrappedPromises) {
            if (isEqual(ref, stableRef)) {
                return promise;
            }
        }

        const promise = getData(stableRef);
        const wrappedPromise = wrapPromise(promise);
        wrappedPromises.set(stableRef, wrappedPromise);
        return wrappedPromise;
    }, [stableRef]);

    return read();
}
