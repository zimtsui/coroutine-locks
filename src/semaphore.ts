import assert = require('assert');
import { ManualPromise } from '@zimtsui/manual-promise';
import { TryLockError } from './exceptions';


export class Semaphore {
    private consumers: ManualPromise<void>[] = [];

    constructor(private resourceCount = 0) { }

    private refresh(): void {
        if (this.resourceCount && this.consumers.length) {
            this.consumers.pop()!.resolve();
            this.resourceCount--;
        }
    }

    public async p(): Promise<void> {
        const consumer = new ManualPromise<void>();
        this.consumers.push(consumer);
        this.refresh();
        await consumer;
    }

    /**
     * @throws {@link TryLockError}
     */
    public tryp(): void {
        assert(
            this.resourceCount,
            new TryLockError(),
        );
        this.resourceCount--;
    }

    public v(): void {
        this.resourceCount++;
        this.refresh();
    }

    public throw(err: Error): void {
        for (const consumer of this.consumers) consumer.reject(err);
        this.consumers = [];
    }
}
