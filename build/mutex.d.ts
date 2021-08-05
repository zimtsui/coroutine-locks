export declare class Mutex {
    private coroutines;
    private locked;
    private refresh;
    lock(): Promise<void>;
    unlock(): void;
}
