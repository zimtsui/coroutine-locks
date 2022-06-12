import { Mutex } from './mutex';
export declare class ConditionVariable {
    private listeners;
    /**
     * In JavaScript [cooperative multi-coroutine scheduling](https://en.wikipedia.org/wiki/Cooperative_multitasking), a mutex is optional because event loop cannot be switched between the condition checking and the `wait`.
     */
    wait(mutex?: Mutex): Promise<void>;
    signal(): void;
    broadcast(): void;
    throw(err: Error): void;
}
