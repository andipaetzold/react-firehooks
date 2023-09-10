/* eslint-disable jsdoc/require-returns */
import { useEffect, useRef } from "react";

/**
 * @internal
 */
export function useIsMounted() {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    return isMounted;
}
