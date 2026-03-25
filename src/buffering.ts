import { Semaphore } from './semaphore.ts';


export class EventBuffer<T> implements AsyncGenerator<T, void, void>, Disposable {
    protected sem = new Semaphore<T>();
    protected abortController = new AbortController();
    public abortSignal = this.abortController.signal;

    public constructor() {
        this.abortSignal.addEventListener('abort', () => void this.sem[Symbol.dispose]());
    }

    public push(x: T) {
        this.sem.increase(x);
    }

    public [Symbol.dispose]() {
        this.abortController.abort();
        this.sem[Symbol.dispose]();
    }

    public async return(): Promise<IteratorReturnResult<void>> {
        return { done: true, value: this[Symbol.dispose]() };
    }

    public next(): Promise<IteratorResult<T, void>> {
        return this.sem.next();
    }

    public throw(e: unknown): Promise<never> {
        return this.sem.throw(e);
    }

    public async [Symbol.asyncDispose](): Promise<void> {
        return this[Symbol.dispose]();
    }

    public [Symbol.asyncIterator]() {
        return this;
    }

}
