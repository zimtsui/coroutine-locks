import { StateError } from './exceptions.ts';


export abstract class RWLockBase {
    protected readers: PromiseWithResolvers<void>[] = [];
    protected writers: PromiseWithResolvers<void>[] = [];
    protected reading = 0;
    protected writing = false;

    public isAcquiredRead(): boolean {
        return !!this.reading;
    }

    public isAcquiredWrite(): boolean {
        return this.writing;
    }

    public async acquireRead(): Promise<void> {
        const pwr = Promise.withResolvers<void>();
        this.readers.push(pwr);
        this.flush();
        await pwr.promise;
    }

    /**
     * @throws {@link StateError}
     */
    public abstract acquireReadSync(): void;

    public abstract acquireReadTry(): void;

    public async acquireWrite(): Promise<void> {
        const pwr = Promise.withResolvers<void>();
        this.writers.push(pwr);
        this.flush();
        await pwr.promise;
    }

    /**
     * @throws {@link StateError}
     */
    public acquireWriteSync(): void {
        if (!this.writing && !this.reading) {} else throw new StateError();
        this.writing = true;
    }

    public acquireWriteTry(): void {
        if (!this.writing && !this.reading) this.writing = true;
    }

    /**
     * @throws {@link StateError}
     */
    public releaseRead(): void {
        if (this.reading) {} else throw new StateError();
        this.reading--;
        this.flush();
    }

    public releaseReadTry(): void {
        if (this.reading) {
            this.reading--;
            this.flush();
        }
    }

    /**
     * @throws {@link StateError}
     */
    public releaseWrite(): void {
        if (this.writing) {} else throw new StateError();
        this.writing = false;
        this.flush();
    }

    public releaseWriteTry(): void {
        if (this.writing) {
            this.writing = false;
            this.flush();
        }
    }

    public unblock(e: unknown): void {
        for (const resolver of this.readers) resolver.reject(e);
        for (const resolver of this.writers) resolver.reject(e);
        this.readers = [];
        this.writers = [];
    }

    /**
     * @throws {@link StateError}
     */
    public switch(): void {
        if (this.writing) {} else throw new StateError();
        this.writing = false;
        this.reading = 1;
        this.flush();
    }

    protected abstract flush(): void;
}
