import { Mutex } from './mutex';

export class ConditionVariable {
    private coroutines: (() => void)[] = [];

    public async wait(mutex?: Mutex): Promise<void> {
        if (mutex) mutex.unlock();
        await new Promise<void>(resolve => {
            this.coroutines.push(resolve);
        });
        if (mutex) await mutex.lock();
    }

    public signal(): void {
        if (this.coroutines.length)
            this.coroutines.pop()!();
    }

    public broadcast(): void {
        this.coroutines.forEach(coroutine => coroutine());
        this.coroutines = [];
    }
}
