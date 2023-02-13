export declare class Mutex {
    private locked;
    private users;
    private err;
    constructor(locked?: boolean);
    private refresh;
    lock(): Promise<void>;
    /**
     * @throws {@link TryLockError}
     */
    trylock(): void;
    unlock(): void;
    throw(err: Error): void;
}
