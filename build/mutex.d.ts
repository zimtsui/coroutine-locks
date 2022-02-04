export declare class Mutex {
    private locked;
    private coroutines;
    constructor(locked?: boolean);
    private refresh;
    lock(): Promise<void>;
    trylock(): void;
    unlock(): void;
}
