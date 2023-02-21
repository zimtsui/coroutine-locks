export declare class WriteReadBox<T> {
    private x;
    private lock;
    constructor(x: T);
    readLock(): Promise<T>;
    tryReadLock(): T;
    writeLock(): Promise<T>;
    tryWriteLock(): T;
    /**
     * @throws {@link TryError}
     */
    readUnlock(): void;
    /**
     * @throws {@link TryError}
     */
    writeUnlock(x: T): void;
    throw(err: Error): void;
}
