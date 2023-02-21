export declare class ReadWriteBox<T> {
    private x;
    private lock;
    constructor(x: T);
    /**
     * @async
     * @throws {@link TryError}
     */
    readLock(): Promise<T>;
    /**
     * @throws {@link TryError}
     */
    tryReadLock(): T;
    /**
     * @async
     * @throws {@link TryError}
     */
    writeLock(): Promise<T>;
    /**
     * @throws {@link TryError}
     */
    tryWriteLock(): Promise<T>;
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
