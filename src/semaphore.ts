import { assert } from './assert';
import { Pair } from './pair';

export class Semaphore {
    private coroutines: Pair[] = [];

    constructor(private resourceCount = 0) { }

    private refresh(): void {
        if (this.resourceCount && this.coroutines.length) {
            this.coroutines.pop()!.resolve();
            this.resourceCount--;
        }
    }

    public async p(): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.coroutines.push({ resolve, reject });
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

    public throw(err: Error): void {
        for (const { reject } of this.coroutines) reject(err);
        this.coroutines = [];
    }
}
