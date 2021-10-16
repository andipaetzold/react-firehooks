import { useCallback, useMemo, useState } from "react";

/**
 * @internal
 */
interface State<Value, Error> {
    value?: Value;
    loading: boolean;
    error?: Error;
}

/**
 * @internal
 */
export interface UseLoadingValueResult<Value, Error> {
    value?: Value;
    setValue: (value?: Value) => void;
    loading: boolean;
    setLoading: () => void;
    error?: Error;
    setError: (error: Error) => void;
}

/**
 * @internal
 */
export function useLoadingValue<Value, Error = unknown>(defaultValue?: Value): UseLoadingValueResult<Value, Error> {
    const [state, setState] = useState<State<Value, Error>>({
        error: undefined,
        loading: defaultValue === undefined ? true : false,
        value: defaultValue,
    });

    const setValue = useCallback((value?: Value) => {
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
        [state, setValue, setLoading, setError]
    );
}
