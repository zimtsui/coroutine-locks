export declare class Semaphore {
    private resourceCount;
    private coroutines;
    constructor(resourceCount?: number);
    private refresh;
    p(): Promise<void>;
    tryp(): void;
    v(): void;
}
