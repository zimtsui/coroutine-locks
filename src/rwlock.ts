import { assert } from './assert';
import { Pair } from './pair';

export class Rwlock {
    protected readers: Pair[] = [];
    protected writers: Pair[] = [];
    protected reading = 0;
    protected writing = false;

    protected refresh(): void {
        if (this.writing) return;

        this.reading += this.readers.length;
        for (const { resolve } of this.readers) resolve();
        this.readers = [];

        if (!this.reading && this.writers.length) {
            this.writers.pop()!.resolve();
            this.writing = true;
        }
    }

    public async rdlock(): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.readers.push({ resolve, reject });
            this.refresh();
        });
    }

    public tryrdlock(): void {
        assert(!this.writing, 'Already write locked.');
        this.reading++;
    }

    public async wrlock(): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.writers.push({ resolve, reject });
            this.refresh();
        });
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
        for (const { reject } of this.readers) reject(err);
        for (const { reject } of this.writers) reject(err);
    }
}
