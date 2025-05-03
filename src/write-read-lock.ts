import { ReadWriteLock } from './read-write-lock.js';
import { Mutex } from './mutex.js';
import { Failure } from './types.js';


/**
 * Write read lock - Write priority
 */
export class WriteReadLock {
	private rwlock = new ReadWriteLock();
	private lounge = new Mutex();

	public async acquireRead(): Promise<void> {
		await this.lounge.acquire();
		await this.rwlock.acquireRead();
		this.lounge.release();
	}

	/**
	 * @throws {@link Failure}
	 */
	public acquireReadSync(): void {
		this.lounge.acquireSync();
		this.rwlock.acquireReadSync();
		this.lounge.release();
	}

	public acquireReadTry(): void {
		try { this.acquireReadSync(); } catch (e) {}
	}

	public async acquireWrite(): Promise<void> {
		await this.lounge.acquire();
		await this.rwlock.acquireWrite();
		this.lounge.release();
	}

	/**
	 * @throws {@link Failure}
	 */
	public acquireWriteSync(): void {
		this.lounge.acquireSync();
		this.rwlock.acquireWriteSync();
		this.lounge.release();
	}

	public acquireWriteTry(): void {
		try { this.acquireWriteSync(); } catch (e) {}
	}

	/**
	 * @throws {@link Failure}
	 */
	public releaseRead(): void {
		this.rwlock.releaseRead();
	}

	public releaseReadTry(): void {
		try { this.releaseRead(); } catch (e) {}
	}

	/**
	 * @throws {@link Failure}
	 */
	public releaseWrite(): void {
		this.rwlock.releaseWrite();
	}

	public releaseWriteTry(): void {
		try { this.releaseWrite(); } catch (e) {}
	}

	public throw(err: Error): void {
		this.rwlock.throw(err);
		this.lounge.throw(err);
	}
}
