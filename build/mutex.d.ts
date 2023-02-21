export declare class Mutex {
    private finsem;
    constructor(locked?: boolean);
    /**
     * @async
     * @throws {@link TryError}
     */
    lock(): Promise<void>;
    /**
     * @throws {@link TryError}
     */
    trylock(): void;
    /**
     * @throws {@link TryError}
     */
    unlock(): void;
    throw(err: Error): void;
}
