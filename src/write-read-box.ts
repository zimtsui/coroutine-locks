import { WriteReadLock } from "./write-read-lock";
import { TryError } from "./exceptions";


export class WriteReadBox<T> {
	private lock = new WriteReadLock();

	public constructor(
		private x: T,
	) { }

	/**
	 * @async
	 * @throws {@link TryError}
	 */
	public async readLock(): Promise<T> {
		await this.lock.readLock();
		return this.x;
	}

	/**
	 * @throws {@link TryError}
	 */
	public tryReadLock(): T {
		this.lock.tryReadLock();
		return this.x;
	}

	/**
	 * @async
	 * @throws {@link TryError}
	 */
	public async writeLock(): Promise<T> {
		await this.lock.writeLock();
		return this.x;
	}

	/**
	 * @throws {@link TryError}
	 */
	public tryWriteLock(): T {
		this.lock.tryWriteLock();
		return this.x;
	}

	/**
	 * @throws {@link TryError}
	 */
	public readUnlock(): void {
		this.lock.readUnlock();
	}

	/**
	 * @throws {@link TryError}
	 */
	public writeUnlock(x: T): void {
		this.lock.writeUnlock();
		this.x = x;
	}

	public throw(err: Error) {
		this.lock.throw(err);
	}
}
