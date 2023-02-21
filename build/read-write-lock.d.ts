import { ManualPromise } from '@zimtsui/manual-promise';
/**
 * Read write lock - Write starvation
 */
export declare class ReadWriteLock {
    protected readers: ManualPromise<void>[];
    protected writers: ManualPromise<void>[];
    protected reading: number;
    protected writing: boolean;
    private err;
    protected refresh(): void;
    readLock(): Promise<void>;
    tryReadLock(): void;
    writeLock(): Promise<void>;
    tryWriteLock(): void;
    /**
     * @throws {@link TryError} Not read locked yet.
     */
    readUnlock(): void;
    /**
     * @throws {@link TryError} Not write locked yet.
     */
    writeUnlock(): void;
    throw(err: Error): void;
}
