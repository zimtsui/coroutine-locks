import assert from 'assert';
import { Semaphore } from './semaphore.js';
import { FailureToTry } from './types.js';


export class FiniteSemaphore {
	private used: Semaphore;
	private unused: Semaphore;

	public constructor(capacity: number, resources = 0) {
		assert(resources <= capacity);
		this.used = new Semaphore(resources);
		this.unused = new Semaphore(capacity - resources);
	}

	public async v(): Promise<void> {
		await this.unused.p();
		this.used.v();
	}

	/**
	 * @throws {@link FailureToTry}
	 */
	public tryV(): void {
		this.unused.tryp();
		this.used.v();
	}

	public async p(): Promise<void> {
		await this.used.p();
		this.unused.v();
	}

	/**
	 * @throws {FailureToTry}
	 */
	public tryP(): void {
		this.used.tryp();
		this.unused.v();
	}

	public throw(err: Error): void {
		this.used.throw(err);
		this.unused.throw(err);
	}
}
