import assert = require('assert');
import { ManualPromise } from '@zimtsui/manual-promise';
import { TryError } from './exceptions';


/**
 * Read write lock - Write starvation
 */
export class ReadWriteLock {
	protected readers: ManualPromise<void>[] = [];
	protected writers: ManualPromise<void>[] = [];
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
		assert(this.err === null, <Error>this.err);
		const reader = new ManualPromise<void>();
		this.readers.push(reader);
		this.refresh();
		await reader;
	}

	public tryReadLock(): void {
		assert(this.err === null, <Error>this.err);
		assert(
			!this.writing,
			new TryError(),
		);
		this.reading++;
	}

	public async writeLock(): Promise<void> {
		assert(this.err === null, <Error>this.err);
		const writer = new ManualPromise<void>();
		this.writers.push(writer);
		this.refresh();
		await writer;
	}

	public tryWriteLock(): void {
		assert(this.err === null, <Error>this.err);
		assert(!this.reading, new TryError());
		assert(!this.writing, new TryError());
		this.writing = true;
	}

	/**
	 * @throws {@link TryError} Not read locked yet.
	 */
	public readUnlock(): void {
		assert(this.err === null, <Error>this.err);
		assert(this.reading, new TryError());
		this.reading--;
		this.refresh();
	}

	/**
	 * @throws {@link TryError} Not write locked yet.
	 */
	public writeUnlock(): void {
		assert(this.err === null, <Error>this.err);
		assert(this.writing, new TryError());
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
