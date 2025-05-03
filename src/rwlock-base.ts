import { Failure } from './failure.js';
import { Consumer } from './consumer.js';
import assert from 'assert';


export abstract class RWLockBase {
	protected readers: Consumer[] = [];
	protected writers: Consumer[] = [];
	protected reading = 0;
	protected writing = false;
	protected error: Error | null = null;

	public async acquireRead(): Promise<void> {
		assert(!this.error, this.error as Error);
		const p = new Promise<void>((resolve, reject) => {
			this.readers.push({resolve, reject});
		});
		this.flush();
		await p;
	}

	/**
	 * @throws {@link Failure}
	 */
	public acquireReadSync(): void {
		assert(!this.error, this.error as Error);
		assert(!this.writing, new Failure());
		this.reading++;
	}

	public acquireReadTry(): void {
		try { this.acquireReadSync(); } catch (e) {}
	}

	public async acquireWrite(): Promise<void> {
		assert(!this.error, this.error as Error);
		const p = new Promise<void>((resolve, reject) => {
			this.writers.push({resolve, reject});
		});
		this.flush();
		await p;
	}

	/**
	 * @throws {@link Failure}
	 */
	public acquireWriteSync(): void {
		assert(!this.error, this.error as Error);
		assert(!this.writing && !this.reading, new Failure());
		this.writing = true;
	}

	public acquireWriteTry(): void {
		try { this.acquireWriteSync(); } catch (e) {}
	}

	/**
	 * @throws {@link Failure}
	 */
	public releaseRead(): void {
		assert(!this.error, this.error as Error);
		assert(this.reading, new Failure());
		this.reading--;
		this.flush();
	}

	public releaseReadTry(): void {
		try { this.releaseRead(); } catch (e) {}
	}

	/**
	 * @throws {@link Failure}
	 */
	public releaseWrite(): void {
		assert(!this.error, this.error as Error);
		assert(this.writing, new Failure());
		this.writing = false;
		this.flush();
	}

	public releaseWriteTry(): void {
		try { this.releaseWrite(); } catch (e) {}
	}

	public throw(error: Error): void {
		this.error = error;
		for (const consumer of this.readers) consumer.reject(error);
		for (const consumer of this.writers) consumer.reject(error);
	}

	/**
	 * @throws {@link Failure}
	 */
	public switch(): void {
		assert(!this.error, this.error as Error);
		assert(this.writing, new Failure());
		this.writing = false;
		this.reading = 1;
		this.flush();
	}

	protected abstract flush(): void;
}
