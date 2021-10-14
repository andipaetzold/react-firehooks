export type Source = "default" | "server" | "cache"

export interface GetOptions {
    source?: Source;
}
