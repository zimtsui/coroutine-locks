import assert from 'assert';
import { Semaphore } from './semaphore.js';
import { FailureToTry } from './types.js';


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
	 * @throws {@link FailureToTry}
	 */
	public tryincrease(): void {
		this.free.trydecrease();
		this.used.increase();
	}

	public async decrease(): Promise<void> {
		await this.used.decrease();
		this.free.increase();
	}

	/**
	 * @throws {@link FailureToTry}
	 */
	public trydecrease(): void {
		this.used.trydecrease();
		this.free.increase();
	}

	public throw(err: Error): void {
		this.used.throw(err);
		this.free.throw(err);
	}
}
