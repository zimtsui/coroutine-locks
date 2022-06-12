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
    tryrdlock(): void;
    wrlock(): Promise<void>;
    trywrlock(): void;
    unlock(): void;
    throw(err: Error): void;
}
