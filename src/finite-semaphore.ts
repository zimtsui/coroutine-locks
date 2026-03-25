import { Mutex } from './mutex.ts';
import { Semaphore } from './semaphore.ts';


export class FiniteSemaphore<T> {
    protected used: Semaphore<T>;
    protected free: Semaphore<void>;
    protected lock = new Mutex<void>();

    public constructor(capacity: number) {
        if (Number.isSafeInteger(capacity) && capacity >= 0) {} else throw new Error();
        this.used = new Semaphore();
        this.free = new Semaphore();
        for (let i = 0; i < capacity; i++) this.free.increase();
    }

    public async getSize(): Promise<number> {
        await this.lock.acquire();
        try {
            return this.used.getSize();
        } finally {
            this.lock.release();
        }
    }

    public async decrease(): Promise<T> {
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
        const x = this.used.decreaseSync();
        this.free.increase();
        return x;
    }

    public async increase(x: T): Promise<void> {
        await this.lock.acquire();
        try {
            await this.free.decrease();
            this.used.increase(x);
        } finally {
            this.lock.release();
        }
    }

    public increaseSync(x: T): void {
        this.free.decreaseSync();
        this.used.increase(x);
    }

    public throw(e: unknown): void {
        this.used.throw(e);
        this.free.throw(e);
    }
}
