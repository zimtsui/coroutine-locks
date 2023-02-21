export declare class Semque<T> {
    private deque;
    private finsem;
    constructor(resources?: T[], capacity?: number);
    /**
     * @async
     * @throws {@link TryError}
     */
    push(x: T): Promise<void>;
    /**
     * @throws {@link TryError}
     */
    tryPush(x: T): void;
    /**
     * @async
     * @throws {@link TryError}
     */
    pop(): Promise<T>;
    /**
     * @throws {@link TryError}
     */
    tryPop(): T;
    throw(err: Error): void;
}
