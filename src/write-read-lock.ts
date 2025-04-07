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

	public tryreadlock(): void {
		this.gate.tryacquire();
		this.rwlock.tryreadlock();
		this.gate.release();
	}

	public async writeLock(): Promise<void> {
		await this.gate.acquire();
		await this.rwlock.writeLock();
		this.gate.release();
	}

	public trywritelock(): void {
		this.gate.tryacquire();
		this.rwlock.trywritelock();
		this.gate.release();
	}

	public readunlock(): void {
		this.rwlock.readunlock();
	}

	public writeunlock(): void {
		this.rwlock.writeunlock();
	}

	public throw(err: Error): void {
		this.rwlock.throw(err);
		this.gate.throw(err);
	}
}
