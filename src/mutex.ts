import { FiniteSemaphore } from './finite-semaphore.js';
import { FailureToTry } from './types.js';


export class Mutex {
	private finisem: FiniteSemaphore;

	public constructor(locked = false) {
		this.finisem = new FiniteSemaphore(1, locked ? 0 : 1);
	}

	public async lock(): Promise<void> {
		await this.finisem.p();
	}

	/**
	 * @throws {@link FailureToTry}
	 */
	public tryLock(): void {
		this.finisem.tryP();
	}

	/**
	 * @throws {@link FailureToTry} if the mutex is already unlocked
	 */
	public unlock(): void {
		this.finisem.tryV();
	}

	public throw(err: Error): void {
		this.finisem.throw(err);
	}
}
