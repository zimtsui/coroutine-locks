import { Semaphore } from './semaphore.ts';
import { StateError } from './exceptions.ts';



export class Mutex<T> {
    protected sem = new Semaphore<T>();


    public isAcquired(): boolean {
        return !this.sem.getSize();
    }

    public async acquire(): Promise<T> {
        return await this.sem.decrease();
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

    public throw(e: unknown): void {
        this.sem.throw(e);
    }
}
