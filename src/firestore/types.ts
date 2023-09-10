/**
 * Specifies how the document or query should be fetched
 *
 * `default`: Attempts to provide up-to-date data when possible by waiting for data from the server, but it may return cached data or fail if you are offline and the server cannot be reached.
 * `server`: Reads the document/query from the server. Returns an error if the network is not available.
 * `cache`: Reads the document/query from cache. Returns an error if the document/query is not currently cached.
 */
export type Source = "default" | "server" | "cache";
