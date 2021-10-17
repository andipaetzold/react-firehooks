export function newPromise<T>() {
    let resolve: (value: T) => void;
    let reject: (error: unknown) => void;
    const promise = new Promise<T>((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    // @ts-ignore
    return { promise, resolve, reject };
}
