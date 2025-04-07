import assert from 'assert';
import { FailureToTry, Consumer } from './types.js';
import { Mutex } from './mutex.js';
import { Semaphore } from './semaphore.js';


/**
 * Read write lock - Write starvation
 */
export class ReadWriteLock {
	private readers = new Semaphore();
	private readersLock = new Mutex();
	private occupied = new Mutex();
	private err: Error | null = null;

	public async readLock(): Promise<void> {
		await this.readersLock.acquire();
		if (!this.readers.getSize()) await this.occupied.acquire();
		this.readers.increase();
		this.readersLock.release();
	}

	public async writeLock(): Promise<void> {
		await this.occupied.acquire();
	}

	public readUnlock(): void {
		assert(this.readers.getSize());
		this.readers.tryDecrease();
		if (!this.readers.getSize()) this.occupied.release();
	}

	public writeUnlock(): void {
		this.occupied.release();
	}

	public throw(err: Error): void {
		this.err = err;
		this.readers.throw(err);
		this.readersLock.throw(err);
		this.occupied.throw(err);
	}
}
