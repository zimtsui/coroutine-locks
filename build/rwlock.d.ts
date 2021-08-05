export declare class Rwlock {
    private readers;
    private writers;
    private state;
    private refresh;
    rlock(): Promise<void>;
    wlock(): Promise<void>;
    unlock(): void;
}
