export declare class Semque<T> {
    private deque;
    private finsem;
    constructor(resources?: T[], capacity?: number);
    /**
     * @async
     * @throws {@link TryError}
     */
    push(x: T): Promise<void>;
    tryPush(x: T): void;
    /**
     * @async
     * @throws {@link TryError}
     */
    pop(): Promise<T>;
    tryPop(): T;
    throw(err: Error): void;
}
