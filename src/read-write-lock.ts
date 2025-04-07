import assert from 'assert';
import { FailureToTry } from './types.js';
import { Mutex } from './mutex.js';
import { Semaphore } from './semaphore.js';


/**
 * Read write lock - Write starvation
 */
export class ReadWriteLock {
	private readers = new Semaphore();
	private readersLock = new Mutex();
	private occupied = new Mutex();

	public async readLock(): Promise<void> {
		await this.readersLock.acquire();
		if (!this.readers.getSize()) await this.occupied.acquire();
		this.readers.increase();
		this.readersLock.release();
	}

	public tryreadlock(): void {
		this.readersLock.tryacquire();
		if (!this.readers.getSize()) this.occupied.tryacquire();
		this.readers.increase();
		this.readersLock.release();
	}

	public async writeLock(): Promise<void> {
		await this.occupied.acquire();
	}

	public trywritelock(): void {
		this.occupied.tryacquire();
	}

	public readunlock(): void {
		assert(this.readers.getSize(), new FailureToTry());
		this.readers.trydecrease();
		if (!this.readers.getSize()) this.occupied.release();
	}

	public writeunlock(): void {
		this.occupied.release();
	}

	public throw(err: Error): void {
		this.readers.throw(err);
		this.readersLock.throw(err);
		this.occupied.throw(err);
	}
}
