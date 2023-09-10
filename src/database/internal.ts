/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
import { Query } from "firebase/database";

/**
 * @internal
 */
export function isQueryEqual(a: Query | undefined, b: Query | undefined): boolean {
    const areBothUndefined = a === undefined && b === undefined;
    const areSameRef = a !== undefined && b !== undefined && a.isEqual(b);
    return areBothUndefined || areSameRef;
}
