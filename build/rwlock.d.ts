export declare class Rwlock {
    private readers;
    private writers;
    private state;
    private refresh;
    rlock(): Promise<void>;
    tryrlock(): void;
    wlock(): Promise<void>;
    trywlock(): void;
    unlock(): void;
}
