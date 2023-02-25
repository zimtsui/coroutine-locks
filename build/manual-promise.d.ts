declare module 'events' {
    function once<T>(ee: EventEmitter, event: string | symbol): Promise<T>;
}
export declare class ManualPromise<T> implements PromiseLike<T> {
    private native;
    private ee;
    constructor();
    /**
     *  @decorator `@boundMethod`
     */
    resolve(value: T | PromiseLike<T>): void;
    /**
     *  @decorator `@boundMethod`
     */
    reject(reason?: any): void;
    then<TResult1 = T, TResult2 = never>(onFulfilled: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
    catch<TResult2>(onRejected: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<T | TResult2>;
    finally(onFinally: () => void): Promise<T>;
}
