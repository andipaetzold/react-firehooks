import { useEffect, useMemo, useRef } from "react";
import { ValueHookResult } from "../common/index.js";
import { useMultiLoadingValue } from "./useMultiLoadingValue.js";

/**
 * @internal
 */
export type UseMultiListenChange<Value, Error, Reference> = (
    ref: Reference,
    onValue: (value: Value | undefined) => void,
    onError: (e: Error) => void
) => () => void;

/**
 * @internal
 */
export function useMultiListen<Value, Error, Reference>(
    references: ReadonlyArray<Reference>,
    onChange: UseMultiListenChange<Value, Error, Reference>,
    isEqualRef: (a: Reference | undefined, b: Reference | undefined) => boolean
): ValueHookResult<Value, Error>[] {
    const { states, setError, setLoading, setValue } = useMultiLoadingValue<Value, Error>(references.length);

    const prevReferences = useRef<ReadonlyArray<Reference>>([]);
    const subscriptions = useRef<(() => void)[]>([]);

    useEffect(() => {
        // unsubscribe and shorten `subscriptions` if number of references was reduced
        subscriptions.current.slice(references.length).forEach((unsubscribe) => unsubscribe());
        subscriptions.current = subscriptions.current.slice(0, references.length);

        // subscribe to new references and unsubscribe to changed references
        references
            .map((ref, refIndex) => [ref, refIndex] as const)
            .filter(([ref, refIndex]) => !isEqualRef(ref, prevReferences.current[refIndex]))
            .forEach(([ref, refIndex]) => {
                subscriptions.current[refIndex]?.();

                setLoading(refIndex);
                subscriptions.current[refIndex] = onChange(
                    ref,
                    (snap) => setValue(refIndex, snap),
                    (error) => setError(refIndex, error)
                );
            });
    }, [references]);

    // unsubscribe on unmount
    useEffect(() => () => subscriptions.current.forEach((unsubscribe) => unsubscribe()), []);

    return useMemo(
        () => states.map((state) => [state.value, state.loading, state.error] as ValueHookResult<Value, Error>),
        states
    );
}
