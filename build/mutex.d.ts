export declare class Mutex {
    private finsem;
    constructor(locked?: boolean);
    lock(): Promise<void>;
    tryLock(): void;
    /**
     * @throws {@link TryError}
     */
    unlock(): void;
    throw(err: Error): void;
}
