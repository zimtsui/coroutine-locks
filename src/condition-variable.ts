import { Mutex } from './mutex';
import { Pair } from './pair';

export class ConditionVariable {
    private coroutines: Pair[] = [];

    public async wait(mutex?: Mutex): Promise<void> {
        if (mutex) mutex.unlock();
        await new Promise<void>((resolve, reject) => {
            this.coroutines.push({ resolve, reject });
        });
        if (mutex) await mutex.lock();
    }

    public signal(): void {
        if (this.coroutines.length)
            this.coroutines.pop()!.resolve();
    }

    public broadcast(): void {
        for (const { resolve } of this.coroutines) resolve();
        this.coroutines = [];
    }

    public throw(err: Error): void {
        for (const { reject } of this.coroutines) reject(err);
        this.coroutines = [];
    }
}
