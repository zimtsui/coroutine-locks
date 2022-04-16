export declare class Mutex {
    private locked;
    private users;
    constructor(locked?: boolean);
    private refresh;
    lock(): Promise<void>;
    trylock(): void;
    unlock(): void;
    throw(err: Error): void;
}
