export function newSymbol<T = unknown>(name: string): T {
    return Symbol(name) as T;
}
