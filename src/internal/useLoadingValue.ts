import { useCallback, useMemo, useState } from "react";

export const LoadingState = Symbol();

/**
 * @internal
 */
interface State<Value, Error> {
    value?: Value | undefined;
    loading: boolean;
    error?: Error | undefined;
}

/**
 * @internal
 */
export interface UseLoadingValueResult<Value, Error> {
    value: Value | undefined;
    setValue: (value?: Value | undefined) => void;
    loading: boolean;
    setLoading: () => void;
    error?: Error | undefined;
    setError: (error: Error) => void;
}

/**
 * @internal
 */
export function useLoadingValue<Value, Error = unknown>(
    initialState: Value | undefined | typeof LoadingState,
): UseLoadingValueResult<Value, Error> {
    const [state, setState] = useState<State<Value, Error>>({
        error: undefined,
        loading: initialState === LoadingState ? true : false,
        value: initialState === LoadingState ? undefined : initialState,
    });

    const setValue = useCallback((value?: Value | undefined) => {
        setState({
            value,
            loading: false,
            error: undefined,
        });
    }, []);

    const setLoading = useCallback(() => {
        setState({
            value: undefined,
            loading: true,
            error: undefined,
        });
    }, []);

    const setError = useCallback((error: Error) => {
        setState({
            value: undefined,
            loading: false,
            error,
        });
    }, []);

    return useMemo(
        () => ({
            value: state.value,
            setValue,
            loading: state.loading,
            setLoading,
            error: state.error,
            setError,
        }),
        [state, setValue, setLoading, setError],
    );
}
