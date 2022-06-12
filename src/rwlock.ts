import assert = require('assert');
import { PublicManualPromise } from './public-manual-promise';


/**
 * Read write lock - Write starvation
 */
export class Rwlock {
    protected readers: PublicManualPromise[] = [];
    protected writers: PublicManualPromise[] = [];
    protected reading = 0;
    protected writing = false;

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
        const reader = new PublicManualPromise();
        this.readers.push(reader);
        this.refresh();
        await reader;
    }

    public tryrdlock(): void {
        assert(!this.writing, 'Already write locked.');
        this.reading++;
    }

    public async wrlock(): Promise<void> {
        const writer = new PublicManualPromise();
        this.writers.push(writer);
        this.refresh();
        await writer;
    }

    public trywrlock(): void {
        assert(!this.reading, 'Already read locked');
        assert(!this.writing, 'Already write locked');
        this.writing = true;
    }

    public unlock(): void {
        if (this.reading) this.reading--;
        if (this.writing) this.writing = false;
        this.refresh();
    }

    public throw(err: Error): void {
        for (const reader of this.readers) reader.reject(err);
        this.readers = [];
        for (const writer of this.writers) writer.reject(err);
        this.writers = [];
    }
}
