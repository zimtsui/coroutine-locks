import assert from 'assert';
import { FailureToTry, Consumer } from './types.js';


/**
 * Read write lock - Write starvation
 */
export class ReadWriteLock {
	protected readers: Consumer[] = [];
	protected writers: Consumer[] = [];
	protected reading = 0;
	protected writing = false;
	private err: Error | null = null;

	protected refresh(): void {
		if (this.writing) return;

		this.reading += this.readers.length;
		for (const reader of this.readers) reader.resolve();
		this.readers = [];

		if (!this.reading && this.writers.length) {
			this.writers.pop()!.resolve();
			this.writing = true;
		}
	}

	public async readLock(): Promise<void> {
		assert(!this.err, <Error>this.err);
		const p = new Promise<void>((resolve, reject) => {
			this.readers.push({resolve, reject});
		});
		this.refresh();
		await p;
	}

	public tryReadLock(): void {
		assert(!this.err, <Error>this.err);
		assert(!this.writing, new FailureToTry());
		this.reading++;
	}

	public async writeLock(): Promise<void> {
		assert(!this.err, <Error>this.err);
		const p = new Promise<void>((resolve, reject) => {
			this.writers.push({resolve, reject});
		});
		this.refresh();
		await p;
	}

	/**
	 * @throws {@link FailureToTry}
	 */
	public tryWriteLock(): void {
		assert(!this.err, <Error>this.err);
		assert(!this.reading, new FailureToTry());
		assert(!this.writing, new FailureToTry());
		this.writing = true;
	}

	/**
	 * @throws {@link FailureToTry} Not read locked yet.
	 */
	public readUnlock(): void {
		assert(!this.err, <Error>this.err);
		assert(this.reading, new FailureToTry());
		this.reading--;
		this.refresh();
	}

	/**
	 * @throws {@link FailureToTry} Not write locked yet.
	 */
	public writeUnlock(): void {
		assert(!this.err, <Error>this.err);
		assert(this.writing, new FailureToTry());
		this.writing = false;
		this.refresh();
	}

	public throw(err: Error): void {
		for (const reader of this.readers) reader.reject(err);
		this.readers = [];
		for (const writer of this.writers) writer.reject(err);
		this.writers = [];
		this.err = err;
	}
}
