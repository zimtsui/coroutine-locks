export declare class Semaphore {
    private coroutines;
    private resourceCount;
    private refresh;
    p(): Promise<void>;
    v(): void;
}
