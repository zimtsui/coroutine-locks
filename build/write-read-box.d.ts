export declare class WriteReadBox<T> {
    private x;
    private lock;
    constructor(x: T);
    readLock(): Promise<T>;
    tryReadLock(): T;
    writeLock(): Promise<T>;
    tryWriteLock(): Promise<T>;
    readUnlock(): void;
    writeUnlock(x: T): void;
    throw(err: Error): void;
}
