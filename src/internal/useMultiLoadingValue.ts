import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * @internal
 */
interface State<Value, Error> {
    readonly value?: Value | undefined;
    readonly loading: boolean;
    readonly error?: Error | undefined;
}

/**
 * @internal
 */
export interface UseMultiLoadingValueResult<Value, Error = unknown> {
    readonly states: ReadonlyArray<State<Value, Error>>;
    readonly setValue: (index: number, value?: Value | undefined) => void;
    readonly setLoading: (index: number) => void;
    readonly setError: (index: number, error?: Error | undefined) => void;
}

const DEFAULT_STATE = {
    error: undefined,
    loading: true,
    value: undefined,
};

/**
 * @internal
 */
export function useMultiLoadingValue<Value, Error = unknown>(size: number): UseMultiLoadingValueResult<Value, Error> {
    const [states, setState] = useState<State<Value, Error>[]>(() => Array.from({ length: size }).map(() => DEFAULT_STATE));

    const setValue = useCallback((index: number, value?: Value | undefined) => {
        setState((curStates) =>
            curStates.map((state, stateIndex) =>
                stateIndex === index
                    ? {
                          value: value,
                          loading: false,
                          error: undefined,
                      }
                    : state,
            ),
        );
    }, []);

    const setLoading = useCallback((index: number) => {
        setState((curStates) =>
            curStates.map((state, stateIndex) =>
                stateIndex === index
                    ? {
                          value: undefined,
                          loading: true,
                          error: undefined,
                      }
                    : state,
            ),
        );
    }, []);

    const setError = useCallback((index: number, error?: Error | undefined) => {
        setState((curStates) =>
            curStates.map((state, stateIndex) =>
                stateIndex === index
                    ? {
                          value: undefined,
                          loading: false,
                          error,
                      }
                    : state,
            ),
        );
    }, []);

    useEffect(() => {
        if (states.length === size) {
            return;
        }

        setState((curStates) => {
            if (curStates.length > size) {
                return curStates.slice(0, size);
            } else if (curStates.length < size) {
                return [...curStates, ...Array.from({ length: size - curStates.length }).map(() => DEFAULT_STATE)];
                /* c8 ignore next 3 */
            } else {
                return curStates;
            }
        });
    }, [size, states.length]);

    return useMemo(() => ({ states, setValue, setLoading, setError }), [states, setValue, setLoading, setError]);
}
