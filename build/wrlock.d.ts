export declare class Wrlock {
    private readers;
    private writers;
    private state;
    private refresh;
    rlock(): Promise<void>;
    wlock(): Promise<void>;
    unlock(): void;
}
