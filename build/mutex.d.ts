export declare class Mutex {
    private finsem;
    constructor(locked?: boolean);
    lock(): Promise<void>;
    /**
     * @throws {@link TryError}
     */
    trylock(): void;
    unlock(): void;
    throw(err: Error): void;
}
