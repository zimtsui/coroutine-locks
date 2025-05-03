import { FiniteSemaphore } from './finite-semaphore.js';
import { Failure } from './types.js';


export class Mutex {
	private finisem: FiniteSemaphore;

	public constructor(acquired = false) {
		this.finisem = new FiniteSemaphore(1, acquired ? 0 : 1);
	}

	public isacquired(): boolean {
		return this.finisem.getSize() === 0;
	}

	public async acquire(): Promise<void> {
		await this.finisem.decrease();
	}

	/**
	 * @throws {@link Failure}
	 */
	public acquireSync(): void {
		this.finisem.decreaseSync();
	}

	/**
	 * @throws {@link Failure} if the mutex is already unlocked
	 */
	public release(): void {
		this.finisem.increaseSync();
	}

	public releaseTry(): void {
		this.finisem.increaseTry();
	}

	public throw(err: Error): void {
		this.finisem.throw(err);
	}
}
