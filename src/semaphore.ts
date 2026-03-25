import { StateError } from './exceptions.ts';


export class Semaphore<T> implements AsyncIterableIterator<T, never, void> {
    protected resolvers: PromiseWithResolvers<T>[] = [];
    protected queue: T[] = [];

    protected flush(): void {
        if (this.queue.length && this.resolvers.length)
            this.resolvers.shift()!.resolve(this.queue.shift()!);
    }

    public getSize(): number {
        return this.queue.length;
    }

    public async decrease(): Promise<T> {
        const pwr = Promise.withResolvers<T>();
        this.resolvers.push(pwr);
        this.flush();
        return await pwr.promise;
    }

    /**
     * @throws {@link StateError}
     */
    public decreaseSync(): T {
        if (this.queue.length) {} else throw new StateError();
        return this.queue.shift()!;
    }

    public increase(x: T): void {
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
        for (const resolver of this.resolvers) resolver.reject(e);
        this.resolvers = [];
    }

    public [Symbol.asyncIterator]() {
        return this;
    }
}
