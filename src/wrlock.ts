import { RWLockBase } from './rwlock-base.ts';


/**
 * Write priority
 */
export class WRLock extends RWLockBase {
    protected flush(): void {
        if (!this.writing && !this.writers.length && this.readers.length) {
            this.reading += this.readers.length;
            for (const consumer of this.readers) consumer.resolve();
            this.readers = [];
        } else if (!this.reading && !this.writing && this.writers.length) {
            this.writing = true;
            this.writers.shift()!.resolve();
        }
    }
}
