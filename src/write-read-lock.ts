import { ReadWriteLock } from './read-write-lock.js';
import { Mutex } from './mutex.js';


/**
 * Write read lock - Write priority
 */
export class WriteReadLock {
	private rwlock = new ReadWriteLock();
	private gate = new Mutex();

	public async readLock(): Promise<void> {
		await this.gate.acquire();
		await this.rwlock.readLock();
		this.gate.release();
	}

	public async writeLock(): Promise<void> {
		await this.gate.acquire();
		await this.rwlock.writeLock();
		this.gate.release();
	}

	public readUnlock(): void {
		this.rwlock.readUnlock();
	}

	public writeUnlock(): void {
		this.rwlock.writeUnlock();
	}

	public throw(err: Error): void {
		this.rwlock.throw(err);
		this.gate.throw(err);
	}
}
