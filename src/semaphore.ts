import assert = require('assert');
import { PublicManualPromise } from './public-manual-promise';


export class Semaphore {
    private consumers: PublicManualPromise[] = [];

    constructor(private resourceCount = 0) { }

    private refresh(): void {
        if (this.resourceCount && this.consumers.length) {
            this.consumers.pop()!.resolve();
            this.resourceCount--;
        }
    }

    public async p(): Promise<void> {
        const consumer = new PublicManualPromise();
        this.consumers.push(consumer);
        this.refresh();
        await consumer;
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
        for (const consumer of this.consumers) consumer.reject(err);
        this.consumers = [];
    }
}
