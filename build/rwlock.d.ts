import { Pair } from './pair';
export declare class Rwlock {
    protected readers: Pair[];
    protected writers: Pair[];
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
