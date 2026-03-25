import { Semaphore } from './semaphore.ts';
import { StateError } from './exceptions.ts';



export class Mutex<T> implements AsyncGenerator<T, void, void>, Disposable {
    protected sem = new Semaphore<T>();

    public isAcquired(): boolean {
        return !this.sem.getSize();
    }

    public acquire(): Promise<T> {
        return this.sem.decrease();
    }

    /**
     * @throws {@link StateError}
     */
    public acquireSync(): T {
        return this.sem.decreaseSync();
    }

    /**
     * @throws {@link StateError}
     */
    public release(x: T): void {
        if (!this.isAcquired()) {} else throw new StateError();
        this.sem.increase(x);
    }

    public releaseTry(x: T): void {
        try {
            this.release(x);
        } catch (e) {
            if (e instanceof StateError) {} else throw e;
        }
    }

    public [Symbol.dispose](): void {
        return this.sem[Symbol.dispose]();
    }

    public [Symbol.asyncDispose](): Promise<void> {
        return this.sem[Symbol.asyncDispose]();
    }

    public throw(e: unknown): Promise<never> {
        return this.sem.throw(e);
    }

    public next(): Promise<IteratorResult<T>> {
        return this.sem.next();
    }

    public return(): Promise<IteratorReturnResult<void>> {
        return this.sem.return();
    }

    public [Symbol.asyncIterator]() {
        return this;
    }
}
