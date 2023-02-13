import { Mutex } from './mutex';
import { ManualPromise } from '@zimtsui/manual-promise';
import assert = require('assert');


export class ConditionVariable {
    private listeners: ManualPromise<void>[] = [];
    private err: Error | null = null;

    /**
     * In JavaScript [cooperative multi-coroutine scheduling](https://en.wikipedia.org/wiki/Cooperative_multitasking), a mutex is optional because event loop cannot be switched between the condition checking and the `wait`.
     */
    public async wait(mutex?: Mutex): Promise<void> {
        assert(this.err === null, <Error>this.err);
        if (mutex) mutex.unlock();
        const listener = new ManualPromise<void>();
        this.listeners.push(listener);
        await listener;
        if (mutex) await mutex.lock();
    }

    public signal(): void {
        assert(this.err === null, <Error>this.err);
        if (this.listeners.length)
            this.listeners.pop()!.resolve();
    }

    public broadcast(): void {
        assert(this.err === null, <Error>this.err);
        for (const listener of this.listeners) listener.resolve();
        this.listeners = [];
    }

    public throw(err: Error): void {
        for (const listener of this.listeners) listener.reject(err);
        this.listeners = [];
        this.err = err;
    }
}
