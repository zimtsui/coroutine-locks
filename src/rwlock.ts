import { RWLockBase } from './rwlock-base.ts';
import { StateError } from './exceptions.ts';


/**
 * Write starvation
 */
export class RWLock extends RWLockBase {
    protected flush(): void {
        if (!this.writing && this.readers.length) {
            this.reading += this.readers.length;
            for (const reader of this.readers) reader.resolve();
            this.readers = [];
        } else if (!this.reading && !this.writing && this.writers.length) {
            this.writing = true;
            this.writers.shift()!.resolve();
        }
    }

    public override acquireReadSync(): void {
        if (!this.writing) {} else throw new StateError();
        this.reading++;
    }
}
