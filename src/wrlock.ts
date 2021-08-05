export class Wrlock {
    private readers: (() => void)[] = [];
    private writers: (() => void)[] = [];
    private state = 0;

    private refresh(): void {
        if (this.state === -1) return;
        while (this.readers.length && !this.writers.length) {
            const reader = this.readers.pop()!;
            this.state++;
            reader();
        }
        if (this.state === 0 && this.writers.length) {
            const writer = this.writers.pop()!;
            this.state = -1;
            writer();
        }
    }

    public async rlock(): Promise<void> {
        await new Promise<void>(resolve => {
            this.readers.push(resolve);
            this.refresh();
        });
    }

    public async wlock(): Promise<void> {
        await new Promise<void>(resolve => {
            this.writers.push(resolve);
            this.refresh();
        });
    }

    public unlock(): void {
        if (this.state > 0) this.state--;
        if (this.state === -1) this.state = 0;
        this.refresh();
    }
}
