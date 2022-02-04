export declare class Rwlock {
    protected readers: (() => void)[];
    protected writers: (() => void)[];
    protected reading: number;
    protected writing: boolean;
    protected refresh(): void;
    rdlock(): Promise<void>;
    tryrdlock(): void;
    wrlock(): Promise<void>;
    trywrlock(): void;
    unlock(): void;
}
