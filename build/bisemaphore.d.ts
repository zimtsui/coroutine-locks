export declare class FiniteSemaphore {
    private used;
    private unused;
    constructor(resourceCount?: number, capacity?: number);
    /**
     * @async
     * @throws {@link TryError}
     */
    v(): Promise<void>;
    /**
     * @throws {@link TryError}
     */
    tryV(): void;
    /**
     * @async
     * @throws {@link TryError}
     */
    p(): Promise<void>;
    /**
     * @throws {@link TryError}
     */
    tryP(): void;
    throw(err: Error): void;
}
