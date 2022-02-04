import chai = require('chai');
const { assert } = chai;

export class Semaphore {
    private coroutines: (() => void)[] = [];

    constructor(private resourceCount = 0) { }

    private refresh(): void {
        if (this.resourceCount && this.coroutines.length) {
            this.coroutines.pop()!();
            this.resourceCount--;
        }
    }

    public async p(): Promise<void> {
        await new Promise<void>(resolve => {
            this.coroutines.push(resolve);
            this.refresh();
        });
    }

    public tryp(): void {
        assert(this.resourceCount, 'No resource.');
        this.resourceCount--;
    }

    public v(): void {
        this.resourceCount++;
        this.refresh();
    }
}
