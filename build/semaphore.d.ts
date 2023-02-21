export declare class Semaphore {
    private resourceCount;
    private consumers;
    private err;
    constructor(resourceCount?: number);
    private refresh;
    p(): Promise<void>;
    tryp(): void;
    v(): void;
    throw(err: Error): void;
}
