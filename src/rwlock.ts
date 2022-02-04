import chai = require('chai');
const { assert } = chai;

export class Rwlock {
    protected readers: (() => void)[] = [];
    protected writers: (() => void)[] = [];
    protected reading = 0;
    protected writing = false;

    protected refresh(): void {
        if (this.writing) return;

        this.reading += this.readers.length;
        for (const reader of this.readers) reader();
        this.readers = [];

        if (!this.reading && this.writers.length) {
            this.writers.pop()!();
            this.writing = true;
        }
    }

    public async rdlock(): Promise<void> {
        await new Promise<void>(resolve => {
            this.readers.push(resolve);
            this.refresh();
        });
    }

    public tryrdlock(): void {
        assert(!this.writing, 'Already write locked.');
        this.reading++;
    }

    public async wrlock(): Promise<void> {
        await new Promise<void>(resolve => {
            this.writers.push(resolve);
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
}
