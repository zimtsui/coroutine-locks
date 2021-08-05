import { Mutex } from './mutex';
export declare class ConditionVariable {
    private coroutines;
    wait(mutex: Mutex): Promise<void>;
    signal(): void;
    broadcast(): void;
}
