export class Mutex {
    private coroutines: (() => void)[] = [];
    private locked = false;

    private refresh(): void {
        if (this.locked) return;
        if (!this.coroutines.length) return;
        this.locked = true;
        const coroutine = this.coroutines.pop()!;
        coroutine();
    }

    public async lock(): Promise<void> {
        await new Promise<void>(resolve => {
            this.coroutines.push(resolve);
            this.refresh();
        });
    }

    public unlock(): void {
        this.locked = false;
        this.refresh();
    }
}
