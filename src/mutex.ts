import { FiniteSemaphore } from './finite-semaphore.js';
import { FailureToTry } from './types.js';


export class Mutex {
	private finisem: FiniteSemaphore;

	public constructor(acquired = false) {
		this.finisem = new FiniteSemaphore(1, acquired ? 0 : 1);
	}

	public isAcquired(): boolean {
		return this.finisem.getSize() === 0;
	}

	public async acquire(): Promise<void> {
		await this.finisem.decrease();
	}

	/**
	 * @throws {@link FailureToTry}
	 */
	public tryacquire(): void {
		this.finisem.trydecrease();
	}

	/**
	 * @throws {@link FailureToTry} if the mutex is already unlocked
	 */
	public release(): void {
		this.finisem.tryincrease();
	}

	public throw(err: Error): void {
		this.finisem.throw(err);
	}
}
