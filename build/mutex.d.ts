export declare class Mutex {
    private finisem;
    constructor(locked?: boolean);
    lock(): Promise<void>;
    tryLock(): void;
    /**
     * @throws {@link TryError}
     */
    unlock(): void;
    throw(err: Error): void;
}
