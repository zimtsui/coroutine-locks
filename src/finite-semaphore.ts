import assert from 'assert';
import { Semaphore } from './semaphore.js';
import { Failure } from './types.js';


export class FiniteSemaphore {
	private used: Semaphore;
	private free: Semaphore;

	public constructor(capacity: number, size = 0) {
		assert(Number.isInteger(capacity) && capacity >= 0);
		assert(Number.isInteger(size) && size >= 0);
		assert(size <= capacity);
		this.used = new Semaphore(size);
		this.free = new Semaphore(capacity - size);
	}

	public getSize(): number {
		return this.used.getSize();
	}

	public async increase(): Promise<void> {
		await this.free.decrease();
		this.used.increase();
	}

	/**
	 * @throws {@link Failure}
	 */
	public increaseSync(): void {
		this.free.decreaseSync();
		this.used.increase();
	}

	public increaseTry(): void {
		try { this.increaseSync(); } catch(e) {}
	}

	public async decrease(): Promise<void> {
		await this.used.decrease();
		this.free.increase();
	}

	/**
	 * @throws {@link Failure}
	 */
	public decreaseSync(): void {
		this.used.decreaseSync();
		this.free.increase();
	}

	public throw(err: Error): void {
		this.used.throw(err);
		this.free.throw(err);
	}
}
