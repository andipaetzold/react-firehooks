import { Query } from "firebase/database";
import { useStableValue } from "../util/useStableValue";

/**
 * @internal
 */
function isQueryEqual(a: Query | undefined, b: Query | undefined): boolean {
    const areBothUndefined = a === undefined || b === undefined;
    const areSameRef = a !== undefined && b !== undefined && a.isEqual(b);
    return areBothUndefined || areSameRef;
}

/**
 * @internal
 */
export function useStableQuery(query: Query | undefined): Query | undefined {
    return useStableValue(query, isQueryEqual);
}
