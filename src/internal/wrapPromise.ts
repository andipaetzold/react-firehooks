type Status = "pending" | "success" | "error";

export type WrappedPromise<T> = () => T;

/**
 * @internal
 */
export function wrapPromise<T>(promise: PromiseLike<T>): WrappedPromise<T> {
    let status: Status = "pending";
    let response: T;

    const suspender = promise.then(
        (result) => {
            status = "success";
            response = result;
        },
        (error) => {
            status = "error";
            response = error;
        },
    );

    return () => {
        switch (status) {
            case "pending":
                throw suspender;
            case "error":
                throw response;
            case "success":
                return response;
        }
    };
}
