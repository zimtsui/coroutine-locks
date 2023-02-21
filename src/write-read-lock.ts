import { ReadWriteLock } from './read-write-lock';

/**
 * Write read lock - Write priority
 */
export class WriteReadLock extends ReadWriteLock {
	protected refresh(): void {
		if (this.writing) return;

		if (!this.writers.length) {
			this.reading += this.readers.length;
			for (const { resolve } of this.readers) resolve();
			this.readers = [];
		} else if (!this.reading) {
			this.writers.pop()!.resolve();
			this.writing = true;
		}
	}
}
