import { Disposed } from './exceptions.ts';
import { Mutex } from './mutex.ts';
import { Semaphore } from './semaphore.ts';


export class FiniteSemaphore<T> implements AsyncGenerator<T, void, void>, Disposable {
    protected used: Semaphore<T>;
    protected free: Semaphore<void>;
    protected lock = new Mutex<void>();
    protected available = true;
    protected e: unknown = new Disposed();

    public constructor(capacity: number) {
        if (Number.isSafeInteger(capacity) && capacity >= 0) {} else throw new Error();
        this.used = new Semaphore();
        this.free = new Semaphore();
        for (let i = 0; i < capacity; i++) this.free.increase();
    }

    public async getSize(): Promise<number> {
        if (this.available) {} else throw this.e;
        await this.lock.acquire();
        try {
            return this.used.getSize();
        } finally {
            this.lock.release();
        }
    }

    public async decrease(): Promise<T> {
        if (this.available) {} else throw this.e;
        await this.lock.acquire();
        try {
            const x = await this.used.decrease();
            this.free.increase();
            return x;
        } finally {
            this.lock.release();
        }
    }

    public decreaseSync(): T {
        if (this.available) {} else throw this.e;
        const x = this.used.decreaseSync();
        this.free.increase();
        return x;
    }

    public async increase(x: T): Promise<void> {
        if (this.available) {} else throw this.e;
        await this.lock.acquire();
        try {
            await this.free.decrease();
            this.used.increase(x);
        } finally {
            this.lock.release();
        }
    }

    public increaseSync(x: T): void {
        if (this.available) {} else throw this.e;
        this.free.decreaseSync();
        this.used.increase(x);
    }

    public [Symbol.dispose](): void {
        if (this.available) {} else throw this.e;
        this.available = false;
        this.used[Symbol.dispose]();
        this.free[Symbol.dispose]();
    }

    public async [Symbol.asyncDispose](): Promise<void> {
        return this[Symbol.dispose]();
    }

    public async next(): Promise<IteratorResult<T>> {
        if (this.available) {} else throw this.e;
        try {
            return {
                done: false,
                value: await this.decrease(),
            };
        } catch (e) {
            if (e instanceof Disposed) {} else throw e;
            return { done: true, value: void undefined };
        }
    }

    public async throw(e: unknown): Promise<never> {
        this.e = e;
        this[Symbol.dispose]();
        throw e;
    }

    public async return(): Promise<IteratorReturnResult<void>> {
        return { done: true, value: this[Symbol.dispose]() };
    }

    public [Symbol.asyncIterator]() {
        return this;
    }
}
