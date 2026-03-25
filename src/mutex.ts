import { Semaphore } from './semaphore.ts';
import { StateError } from './exceptions.ts';


/**
 * A mutex is initially locked.
 */
export class Mutex<T> implements AsyncIterableIterator<T, never, void> {
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
        if (this.isAcquired()) {} else throw new StateError();
        this.sem.increase(x);
    }

    public releaseTry(x: T): void {
        try {
            this.release(x);
        } catch (e) {
            if (e instanceof StateError) {} else throw e;
        }
    }

    public unblock(e: unknown): void {
        return this.sem.unblock(e);
    }

    public next(): Promise<IteratorYieldResult<T>> {
        return this.sem.next();
    }

    public [Symbol.asyncIterator]() {
        return this;
    }
}
