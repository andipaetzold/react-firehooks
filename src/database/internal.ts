import { Query } from "firebase/database";
import * as a from "@firebase/installations";

/**
 * @internal
 */
export function isQueryEqual(a: Query | undefined, b: Query | undefined): boolean {
    const areBothUndefined = a === undefined && b === undefined;
    const areSameRef = a !== undefined && b !== undefined && a.isEqual(b);
    return areBothUndefined || areSameRef;
}
