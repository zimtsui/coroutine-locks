import { PublicManualPromise } from './public-manual-promise';
/**
 * Read write lock - Write starvation
 */
export declare class Rwlock {
    protected readers: PublicManualPromise[];
    protected writers: PublicManualPromise[];
    protected reading: number;
    protected writing: boolean;
    protected refresh(): void;
    rdlock(): Promise<void>;
    /**
     * @throws {@link TryLockError}
     */
    tryrdlock(): void;
    wrlock(): Promise<void>;
    /**
     * @throws {@link TryLockError}
     */
    trywrlock(): void;
    unlock(): void;
    throw(err: Error): void;
}
