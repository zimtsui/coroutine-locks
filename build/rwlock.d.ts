import { PublicManualPromise } from './public-manual-promise';
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
