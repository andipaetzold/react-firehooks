import { ValueHookResult } from "../common/index.js";
import { useOnceNoSuspense } from "./useOnceNoSuspense.js";
import { useOnceSuspense } from "./useOnceSuspense.js";
import { useStableValue } from "./useStableValue.js";

/**
 * @internal
 */
export function useOnce<Value, Error, Reference>(
    reference: Reference | undefined,
    getData: (ref: Reference) => Promise<Value>,
    isEqual: (a: Reference | undefined, b: Reference | undefined) => boolean,
    suspense = false,
): ValueHookResult<Value, Error> {
    const stableRef = useStableValue(reference ?? undefined, isEqual);

    const suspenseResult = useOnceSuspense<Value, Error, Reference>(stableRef, getData, isEqual, suspense);
    const noSuspenseResult = useOnceNoSuspense<Value, Error, Reference>(stableRef, getData, !suspense);

    return suspense ? suspenseResult! : noSuspenseResult!;
}
