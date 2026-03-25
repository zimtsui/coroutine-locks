import { Disposed, StateError } from './exceptions.ts';



export class Semaphore<T> {
    protected resolvers: PromiseWithResolvers<T>[] = [];
    protected queue: T[] = [];
    protected e: unknown;
    protected available = true;

    protected flush(): void {
        if (this.queue.length && this.resolvers.length)
            this.resolvers.shift()!.resolve(this.queue.shift()!);
    }

    public getSize(): number {
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

    public [Symbol.dispose](): void {
        this.throw(new Disposed());
    }

    public throw(e: unknown): void {
        this.available = false;
        this.e = e;
        for (const resolver of this.resolvers) resolver.reject(e);
    }
}
