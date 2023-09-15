import { useEffect, useMemo, useRef } from "react";
import { ValueHookResult } from "../common/index.js";
import { useIsMounted } from "./useIsMounted.js";
import { useMultiLoadingValue } from "./useMultiLoadingValue.js";

/**
 * @internal
 */
export function useMultiGet<Value, Error, Reference>(
    references: ReadonlyArray<Reference>,
    getData: (ref: Reference) => Promise<Value>,
    isEqual: (a: Reference | undefined, b: Reference | undefined) => boolean,
): ValueHookResult<Value, Error>[] {
    const isMounted = useIsMounted();

    const { states, setError, setLoading, setValue } = useMultiLoadingValue<Value, Error>(references.length);
    const prevReferences = useRef<Reference[]>([]);

    useEffect(() => {
        // shorten `prevReferences` size if number of references was reduced
        prevReferences.current = prevReferences.current.slice(0, references.length);

        // fetch to new references
        const changedReferences = references
            .map((ref, refIndex) => [ref, refIndex] as const)
            .filter(([ref, refIndex]) => !isEqual(ref, prevReferences.current[refIndex]));

        for (const [ref, refIndex] of changedReferences) {
            (async () => {
                prevReferences.current[refIndex] = ref;
                setLoading(refIndex);

                try {
                    const data = await getData(ref);
                    if (!isMounted.current) {
                        return;
                    }

                    setValue(refIndex, data);
                } catch (e) {
                    if (!isMounted.current) {
                        return;
                    }

                    // We assume this is always a Error
                    setError(refIndex, e as Error);
                }
            })();
        }

        // TODO: double check dependencies
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [references]);

    return useMemo(
        () => states.map((state) => [state.value, state.loading, state.error] as ValueHookResult<Value, Error>),
        [states],
    );
}
