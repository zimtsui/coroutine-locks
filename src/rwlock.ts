import assert = require('assert');
import { ManualPromise } from '@zimtsui/manual-promise';
import { TryLockError } from './exceptions';


/**
 * Read write lock - Write starvation
 */
export class Rwlock {
    protected readers: ManualPromise<void>[] = [];
    protected writers: ManualPromise<void>[] = [];
    protected reading = 0;
    protected writing = false;
    private err: Error | null = null;

    protected refresh(): void {
        if (this.writing) return;

        this.reading += this.readers.length;
        for (const reader of this.readers) reader.resolve();
        this.readers = [];

        if (!this.reading && this.writers.length) {
            this.writers.pop()!.resolve();
            this.writing = true;
        }
    }

    public async rdlock(): Promise<void> {
        assert(this.err === null, <Error>this.err);
        const reader = new ManualPromise<void>();
        this.readers.push(reader);
        this.refresh();
        await reader;
    }

    /**
     * @throws {@link TryLockError}
     */
    public tryrdlock(): void {
        assert(this.err === null, <Error>this.err);
        assert(
            !this.writing,
            new TryLockError(),
        );
        this.reading++;
    }

    public async wrlock(): Promise<void> {
        assert(this.err === null, <Error>this.err);
        const writer = new ManualPromise<void>();
        this.writers.push(writer);
        this.refresh();
        await writer;
    }

    /**
     * @throws {@link TryLockError}
     */
    public trywrlock(): void {
        assert(this.err === null, <Error>this.err);
        assert(
            !this.reading,
            new TryLockError(),
        );
        assert(
            !this.writing,
            new TryLockError(),
        );
        this.writing = true;
    }

    public unlock(): void {
        assert(this.err === null, <Error>this.err);
        if (this.reading) this.reading--;
        if (this.writing) this.writing = false;
        this.refresh();
    }

    public throw(err: Error): void {
        for (const reader of this.readers) reader.reject(err);
        this.readers = [];
        for (const writer of this.writers) writer.reject(err);
        this.writers = [];
        this.err = err;
    }
}
