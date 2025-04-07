import { Consumer } from './types.js';
import assert from 'assert';


export class ConditionVariable {
	private listeners: Consumer[] = [];
	private err: Error | null = null;

	/**
	 * In JavaScript [cooperative multi-coroutine scheduling](https://en.wikipedia.org/wiki/Cooperative_multitasking), a mutex is optional because event loop cannot be switched between the condition checking and the `wait`.
	 */
	public async wait(): Promise<void> {
		assert(!this.err, <Error>this.err);
		await new Promise<void>((resolve, reject) => {
			this.listeners.push({resolve, reject});
		});
	}

	public signal(): void {
		assert(!this.err, <Error>this.err);
		if (this.listeners.length)
			this.listeners.shift()!.resolve();
	}

	public broadcast(): void {
		assert(!this.err, <Error>this.err);
		for (const listener of this.listeners) listener.resolve();
		this.listeners = [];
	}

	public throw(err: Error): void {
		for (const listener of this.listeners) listener.reject(err);
		this.listeners = [];
		this.err = err;
	}
}
