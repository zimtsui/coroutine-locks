import { Mutex } from './mutex';
import { PublicManualPromise } from './public-manual-promise';


export class ConditionVariable {
    private listeners: PublicManualPromise[] = [];

    public async wait(mutex?: Mutex): Promise<void> {
        if (mutex) mutex.unlock();
        const listener = new PublicManualPromise();
        this.listeners.push(listener);
        await listener;
        if (mutex) await mutex.lock();
    }

    public signal(): void {
        if (this.listeners.length)
            this.listeners.pop()!.resolve();
    }

    public broadcast(): void {
        for (const listener of this.listeners) listener.resolve();
        this.listeners = [];
    }

    public throw(err: Error): void {
        for (const listener of this.listeners) listener.reject(err);
        this.listeners = [];
    }
}
