import { Mutex } from './mutex';

export class ConditionVariable {
    private coroutines: (() => void)[] = [];

    public async wait(mutex: Mutex): Promise<void> {
        mutex.unlock();
        await new Promise<void>(resolve => {
            this.coroutines.push(resolve);
        });
        await mutex.lock();
    }

    public signal(): void {
        if (this.coroutines.length)
            this.coroutines.pop()!();
    }

    public broadcast(): void {
        const coroutines = this.coroutines;
        this.coroutines = [];
        coroutines.forEach(coroutine => coroutine());
    }
}
