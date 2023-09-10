/* eslint-disable jsdoc/require-jsdoc */
export function newSymbol<T = unknown>(name: string): T {
    return Symbol(name) as T;
}
