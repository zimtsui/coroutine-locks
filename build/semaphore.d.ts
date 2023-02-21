export declare class Semaphore {
    private resourceCount;
    private consumers;
    private err;
    constructor(resourceCount?: number);
    private refresh;
    /**
     * @async
     * @throws {@link TryError}
     */
    p(): Promise<void>;
    /**
     * @throws {@link TryError}
     */
    tryp(): void;
    /**
     * @throws {@link TryError}
     */
    v(): void;
    throw(err: Error): void;
}
