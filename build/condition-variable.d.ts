import { Mutex } from './mutex';
export declare class ConditionVariable {
    private listeners;
    wait(mutex?: Mutex): Promise<void>;
    signal(): void;
    broadcast(): void;
    throw(err: Error): void;
}
