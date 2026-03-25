import { Disposed, StateError } from './exceptions.ts';


export class Semaphore<T> implements AsyncGenerator<T, void, void>, Disposable {
    protected resolvers: PromiseWithResolvers<T>[] = [];
    protected queue: T[] = [];
    protected available = true;
    protected e: unknown = new Disposed();

    protected flush(): void {
        if (this.queue.length && this.resolvers.length)
            this.resolvers.shift()!.resolve(this.queue.shift()!);
    }

    public getSize(): number {
        if (this.available) {} else throw this.e;
        return this.queue.length;
    }

    public async decrease(): Promise<T> {
        if (this.available) {} else throw this.e;
        const pwr = Promise.withResolvers<T>();
        this.resolvers.push(pwr);
        this.flush();
        return await pwr.promise;
    }

    /**
     * @throws {@link StateError}
     */
    public decreaseSync(): T {
        if (this.available) {} else throw this.e;
        if (this.queue.length) {} else throw new StateError();
        return this.queue.shift()!;
    }

    public increase(x: T): void {
        if (this.available) {} else throw this.e;
        this.queue.push(x);
        this.flush();
    }

    public async [Symbol.asyncDispose](): Promise<void> {
        return this[Symbol.dispose]();
    }

    public [Symbol.dispose](): void {
        if (this.available) {} else throw this.e;
        this.available = false;
        for (const resolver of this.resolvers) resolver.reject(new Disposed());
    }

    public async next(): Promise<IteratorYieldResult<T>> {
        return {
            done: false,
            value: await this.decrease(),
        };
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
