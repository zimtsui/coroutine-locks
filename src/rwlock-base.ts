import { Disposed, StateError } from './exceptions.ts';


export abstract class RWLockBase implements Disposable {
    protected readers: PromiseWithResolvers<void>[] = [];
    protected writers: PromiseWithResolvers<void>[] = [];
    protected reading = 0;
    protected writing = false;
    protected e: unknown = new Disposed();
    protected available = true;

    public isAcquiredRead(): boolean {
        if (this.available) {} else throw this.e;
        return !!this.reading;
    }

    public isAcquiredWrite(): boolean {
        if (this.available) {} else throw this.e;
        return this.writing;
    }

    public async acquireRead(): Promise<void> {
        if (this.available) {} else throw this.e;
        const pwr = Promise.withResolvers<void>();
        this.readers.push(pwr);
        this.flush();
        await pwr.promise;
    }

    /**
     * @throws {@link StateError}
     */
    public acquireReadSync(): void {
        if (this.available) {} else throw this.e;
        if (!this.writing) {} else throw new StateError();
        this.reading++;
    }

    public acquireReadTry(): void {
        try {
            this.acquireReadSync();
        } catch (e) {
            if (e instanceof StateError) {} else throw e;
        }
    }

    public async acquireWrite(): Promise<void> {
        if (this.available) {} else throw this.e;
        const pwr = Promise.withResolvers<void>();
        this.writers.push(pwr);
        this.flush();
        await pwr.promise;
    }

    /**
     * @throws {@link StateError}
     */
    public acquireWriteSync(): void {
        if (this.available) {} else throw this.e;
        if (!this.writing && !this.reading) {} else throw new StateError();
        this.writing = true;
    }

    public acquireWriteTry(): void {
        try {
            this.acquireWriteSync();
        } catch (e) {
            if (e instanceof StateError) {} else throw e;
        }
    }

    /**
     * @throws {@link StateError}
     */
    public releaseRead(): void {
        if (this.available) {} else throw this.e;
        if (this.reading) {} else throw new StateError();
        this.reading--;
        this.flush();
    }

    public releaseReadTry(): void {
        try {
            this.releaseRead();
        } catch (e) {
            if (e instanceof StateError) {} else throw e;
        }
    }

    /**
     * @throws {@link StateError}
     */
    public releaseWrite(): void {
        if (this.available) {} else throw this.e;
        if (this.writing) {} else throw new StateError();
        this.writing = false;
        this.flush();
    }

    public releaseWriteTry(): void {
        try {
            this.releaseWrite();
        } catch (e) {
            if (e instanceof StateError) {} else throw e;
        }
    }

    public [Symbol.dispose](): void {
        if (this.available) {} else throw this.e;
        this.available = false;
        for (const resolver of this.readers) resolver.reject(this.e);
        for (const resolver of this.writers) resolver.reject(this.e);
    }

    public throw(e: unknown): void {
        this.e = e;
        this[Symbol.dispose]();
        throw e;
    }

    /**
     * @throws {@link StateError}
     */
    public switch(): void {
        if (this.available) {} else throw this.e;
        if (this.writing) {} else throw new StateError();
        this.writing = false;
        this.reading = 1;
        this.flush();
    }

    protected abstract flush(): void;
}
