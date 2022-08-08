import { PublicManualPromise } from '@zimtsui/manual-promise';
/**
 * Read write lock - Write starvation
 */
export declare class Rwlock {
    protected readers: PublicManualPromise<void>[];
    protected writers: PublicManualPromise<void>[];
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
