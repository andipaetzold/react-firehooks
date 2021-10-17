export function newSymbol<T = any>(name: string): T {
    return Symbol(name) as any;
}
