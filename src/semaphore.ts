export class Semaphore {
    private coroutines: (() => void)[] = [];

    constructor(
        private resourceCount = 0,
    ) { }

    private refresh(): void {
        if (this.resourceCount === 0) return;
        if (!this.coroutines.length) return;
        this.resourceCount--;
        const coroutine = this.coroutines.pop()!;
        coroutine();
    }

    public async p(): Promise<void> {
        await new Promise<void>(resolve => {
            this.coroutines.push(resolve);
            this.refresh();
        });
    }

    public v(): void {
        this.resourceCount++;
        this.refresh();
    }
}
