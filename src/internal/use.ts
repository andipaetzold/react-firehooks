export const use = <T>(
    promise: Promise<T> & {
        status?: "pending" | "fulfilled" | "rejected";
        value?: T;
        reason?: unknown;
    },
): T => {
    switch (promise.status) {
        case "pending":
            throw promise;
        case "fulfilled":
            return promise.value as T;
        case "rejected":
            throw promise.reason;
        default:
            promise.status = "pending";
            promise.then(
                (v) => {
                    promise.status = "fulfilled";
                    promise.value = v;
                },
                (e) => {
                    promise.status = "rejected";
                    promise.reason = e;
                },
            );
            throw promise;
    }
};
