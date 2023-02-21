export declare class FiniteSemaphore {
    private used;
    private unused;
    constructor(resourceCount?: number, capacity?: number);
    v(): Promise<void>;
    tryV(): void;
    p(): Promise<void>;
    tryP(): void;
    throw(err: Error): void;
}
