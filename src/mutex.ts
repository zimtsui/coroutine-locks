export class Mutex {
    private coroutines: (() => void)[] = [];
    private locked = false;

    private refresh(): void {
        if (this.locked) return;
        if (!this.coroutines.length) return;
        this.coroutines.pop()!();
        this.locked = true;
    }

    public async lock(): Promise<void> {
        await new Promise<void>(resolve => {
            this.coroutines.push(resolve);
            this.refresh();
        });
    }

    public trylock(): void {
        if (this.locked) throw new Error('Already locked.');
        this.locked = true;
    }

    public unlock(): void {
        this.locked = false;
        this.refresh();
    }
}
