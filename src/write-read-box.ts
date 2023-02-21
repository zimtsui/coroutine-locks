import { WriteReadLock } from "./write-read-lock";

export class WriteReadBox<T> {
	private lock = new WriteReadLock();

	public constructor(
		private x: T,
	) { }

	public async readLock(): Promise<T> {
		await this.lock.readLock();
		return this.x;
	}

	public tryReadLock(): T {
		this.lock.tryReadLock();
		return this.x;
	}

	public async writeLock(): Promise<T> {
		await this.lock.writeLock();
		return this.x;
	}

	public async tryWriteLock(): Promise<T> {
		this.lock.tryWriteLock();
		return this.x;
	}

	public readUnlock(): void {
		this.lock.readUnlock();
	}

	public writeUnlock(x: T): void {
		this.lock.writeUnlock();
		this.x = x;
	}

	public throw(err: Error) {
		this.lock.throw(err);
	}
}
