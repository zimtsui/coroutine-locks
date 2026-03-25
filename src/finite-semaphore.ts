import { StateError } from './exceptions.ts';


export class FiniteSemaphore<T> implements AsyncIterableIterator<T, never, void> {
    protected consumers: PromiseWithResolvers<T>[] = [];
    protected producers: PromiseWithResolvers<void>[] = [];
    protected queue: T[] = [];

    public constructor(protected capacity: number) {
        if (Number.isSafeInteger(this.capacity) && this.capacity >= 0) {} else throw new Error();
    }

    public getSize(): number {
        return Math.min(this.queue.length, this.capacity);
    }

    protected getRealSize(): number {
        return this.queue.length - this.consumers.length;
    }

    protected flush(): void {
        if (this.queue.length && this.consumers.length)
            this.consumers.shift()!.resolve(this.queue.shift()!);
        if (this.queue.length < this.capacity && this.producers.length)
            this.producers.shift()!.resolve();
    }

    public async decrease(): Promise<T> {
        const pwr = Promise.withResolvers<T>();
        this.consumers.push(pwr);
        this.flush();
        return await pwr.promise;
    }

    public decreaseSync(): T {
        if (this.getRealSize() > 0) {} else throw new StateError();
        const x = this.queue.shift()!;
        this.flush();
        return x;
    }

    public async increase(x: T): Promise<void> {
        const pwr = Promise.withResolvers<void>();
        this.producers.push(pwr);
        this.queue.push(x);
        this.flush();
        await pwr.promise;
    }

    public increaseSync(x: T): void {
        if (this.getRealSize() < this.capacity) {} else throw new StateError();
        this.queue.push(x);
        this.flush();
    }

    public async next(): Promise<IteratorYieldResult<T>> {
        return {
            done: false,
            value: await this.decrease(),
        };
    }

    public unblock(e: unknown): void {
        for (const consumer of this.consumers) consumer.reject(e);
        for (const producer of this.producers) producer.reject(e);
        this.consumers = [];
        this.producers = [];
    }

    public [Symbol.asyncIterator]() {
        return this;
    }
}
