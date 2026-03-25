import { StateError } from './failure.ts';
import type { Consumer } from './consumer.ts';


export abstract class RWLockBase {
	protected readers: Consumer[] = [];
	protected writers: Consumer[] = [];
	protected reading = 0;
	protected writing = false;
	protected error: Error | null = null;

	public isAcquiredRead(): boolean {
		if (this.error) throw this.error as Error;
		return !!this.reading;
	}

	public isAcquiredWrite(): boolean {
		if (this.error) throw this.error as Error;
		return this.writing;
	}

	public async acquireRead(): Promise<void> {
		if (this.error) throw this.error as Error;
		const p = new Promise<void>((resolve, reject) => {
			this.readers.push({resolve, reject});
		});
		this.flush();
		await p;
	}

	/**
	 * @throws {@link Failure}
	 */
	public acquireReadSync(): void {
		if (this.error) throw this.error as Error;
		if (!this.writing) {} else throw new StateError();
		this.reading++;
	}

	public acquireReadTry(): void {
		try { this.acquireReadSync(); } catch (e) {}
	}

	public async acquireWrite(): Promise<void> {
		if (this.error) throw this.error as Error;
		const p = new Promise<void>((resolve, reject) => {
			this.writers.push({resolve, reject});
		});
		this.flush();
		await p;
	}

	/**
	 * @throws {@link Failure}
	 */
	public acquireWriteSync(): void {
		if (this.error) throw this.error as Error;
		if (!this.writing && !this.reading) {} else throw new StateError();
		this.writing = true;
	}

	public acquireWriteTry(): void {
		try { this.acquireWriteSync(); } catch (e) {}
	}

	/**
	 * @throws {@link Failure}
	 */
	public releaseRead(): void {
		if (this.error) throw this.error as Error;
		if (this.reading) {} else throw new StateError();
		this.reading--;
		this.flush();
	}

	public releaseReadTry(): void {
		try { this.releaseRead(); } catch (e) {}
	}

	/**
	 * @throws {@link Failure}
	 */
	public releaseWrite(): void {
		if (this.error) throw this.error as Error;
		if (this.writing) {} else throw new StateError();
		this.writing = false;
		this.flush();
	}

	public releaseWriteTry(): void {
		try { this.releaseWrite(); } catch (e) {}
	}

	public throw(error: Error): void {
		this.error = error;
		for (const consumer of this.readers) consumer.reject(error);
		for (const consumer of this.writers) consumer.reject(error);
	}

	/**
	 * @throws {@link Failure}
	 */
	public switch(): void {
		if (this.error) throw this.error as Error;
		if (this.writing) {} else throw new StateError();
		this.writing = false;
		this.reading = 1;
		this.flush();
	}

	protected abstract flush(): void;
}
