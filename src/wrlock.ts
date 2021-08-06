export class Wrlock {
    private readers: (() => void)[] = [];
    private writers: (() => void)[] = [];
    private state = 0;

    private refresh(): void {
        if (this.state === -1) return;

        if (!this.writers.length) {
            this.readers.forEach(reader => {
                reader();
                this.state++;
            });
            this.readers = [];
        }

        if (this.state === 0 && this.writers.length) {
            this.writers.pop()!();
            this.state = -1;
        }
    }

    public async rlock(): Promise<void> {
        await new Promise<void>(resolve => {
            this.readers.push(resolve);
            this.refresh();
        });
    }

    public tryrlock(): void {
        if (this.state === -1) throw new Error('Already wlocked.');
        if (this.writers.length) throw new Error('Writers in queue.');
        this.state++;
    }

    public async wlock(): Promise<void> {
        await new Promise<void>(resolve => {
            this.writers.push(resolve);
            this.refresh();
        });
    }

    public trywlock(): void {
        if (this.state > 0) throw new Error('Already rlocked');
        if (this.state === -1) throw new Error('Already wlocked');
        this.state = -1;
    }

    public unlock(): void {
        if (this.state > 0) this.state--;
        if (this.state === -1) this.state = 0;
        this.refresh();
    }
}
