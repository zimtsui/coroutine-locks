import assert from 'assert';
import { Failure } from './types.js';
import { Mutex } from './mutex.js';
import { Semaphore } from './semaphore.js';


/**
 * Read write lock - Write starvation
 */
export class ReadWriteLock {
	private readers = new Semaphore();
	private readersLock = new Mutex();
	private occupied = new Mutex();

	public async acquireRead(): Promise<void> {
		await this.readersLock.acquire();
		if (!this.readers.getSize()) await this.occupied.acquire();
		this.readers.increase();
		this.readersLock.release();
	}

	/**
	 * @throws {@link Failure}
	 */
	public acquireReadSync(): void {
		this.readersLock.acquireSync();
		if (!this.readers.getSize()) this.occupied.acquireSync();
		this.readers.increase();
		this.readersLock.release();
	}

	public acquireReadTry(): void {
		try { this.acquireReadSync(); } catch (e) {}
	}

	public async acquireWrite(): Promise<void> {
		await this.occupied.acquire();
	}

	/**
	 * @throws {@link Failure}
	 */
	public acquireWriteSync(): void {
		this.occupied.acquireSync();
	}

	public acquireWriteTry(): void {
		try { this.acquireWriteSync(); } catch (e) {}
	}

	/**
	 * @throws {@link Failure}
	 */
	public releaseRead(): void {
		assert(this.readers.getSize(), new Failure());
		this.readers.decreaseSync();
		if (!this.readers.getSize()) this.occupied.release();
	}

	public releaseReadTry(): void {
		try { this.releaseRead(); } catch (e) {}
	}

	/**
	 * @throws {@link Failure}
	 */
	public releaseWrite(): void {
		this.occupied.release();
	}

	public releaseWriteTry(): void {
		this.occupied.releaseTry();
	}

	public throw(err: Error): void {
		this.readers.throw(err);
		this.readersLock.throw(err);
		this.occupied.throw(err);
	}
}
