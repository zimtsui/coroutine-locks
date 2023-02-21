export declare class Semque<T> {
    private deque;
    private finsem;
    constructor(resources?: T[], capacity?: number);
    push(x: T): Promise<void>;
    tryPush(x: T): void;
    pop(): Promise<T>;
    tryPop(): T;
    throw(err: Error): void;
}
