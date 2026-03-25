import type { Mutex } from './mutex.ts';


export class ConditionVariable {
	protected listeners: PromiseWithResolvers<void>[] = [];

	public async wait(mutex: Mutex<void>): Promise<void> {
		mutex.release();
		const pwr = Promise.withResolvers<void>();
		this.listeners.push(pwr);
		try {
			await pwr.promise;
		} finally {
			await mutex.acquire();
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
		for (const listener of this.listeners) listener.reject(e);
		this.listeners = [];
	}
}
