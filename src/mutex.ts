import { Semaphore } from './semaphore.js';
import { StateError } from './failure.js';


export class Mutex {
	private sem: Semaphore;

	public constructor(acquired = false) {
		this.sem = new Semaphore(acquired ? 0 : 1);
	}

	public isAcquired(): boolean {
		return !this.sem.getSize();
	}

	public async acquire(): Promise<void> {
		await this.sem.decrease();
	}

	/**
	 * @throws {@link Failure}
	 */
	public acquireSync(): void {
		this.sem.decreaseSync();
	}

	/**
	 * @throws {@link Failure}
	 */
	public release(): void {
		if (this.isAcquired())
			this.sem.increase();
		else
			throw new StateError();
	}

	public releaseTry(): void {
		try { this.release(); } catch (e) {}
	}

	public throw(err: Error): void {
		this.sem.throw(err);
	}
}
