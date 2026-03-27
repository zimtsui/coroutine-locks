import { Mutex } from './mutex.ts';


export class ConditionVariable {
	protected listeners: PromiseWithResolvers<void>[] = [];
	public mutex = new Mutex<void>();

	public async wait(): Promise<void> {
		this.mutex.release();
		const pwr = Promise.withResolvers<void>();
		this.listeners.push(pwr);
		try {
			await pwr.promise;
		} finally {
			await this.mutex.acquire();
		}
	}

	public signal(): void {
		if (this.listeners.length)
			this.listeners.shift()!.resolve();
	}

	public broadcast(): void {
		for (const listener of this.listeners) listener.resolve();
		this.listeners = [];
	}

	public unblock(e: unknown): void {
		this.mutex.unblock(e);
		for (const listener of this.listeners) listener.reject(e);
		this.listeners = [];
	}
}
