export declare class Semaphore {
    private resourceCount;
    private consumers;
    constructor(resourceCount?: number);
    private refresh;
    p(): Promise<void>;
    /**
     * @throws {@link TryLockError}
     */
    tryp(): void;
    v(): void;
    throw(err: Error): void;
}
