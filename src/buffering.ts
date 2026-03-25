import { Semaphore } from './semaphore.ts';


class End {}

export class EventBuffer<T> implements AsyncIterableIterator<T, void, void>, Disposable {
    protected sem = new Semaphore<T>();
    protected abortController = new AbortController();
    public signal = this.abortController.signal;

    public push(x: T) {
        this.sem.increase(x);
    }

    public [Symbol.dispose]() {
        this.abortController.abort();
        this.sem.unblock(new End());
    }

    public async next(): Promise<IteratorResult<T, void>> {
        try {
            return await this.sem.next();
        } catch (e) {
            if (e instanceof End) {} else throw e;
            return { done: true, value: void undefined };
        }
    }

    public [Symbol.asyncIterator]() {
        return this;
    }

}
