import { Disposed, StateError } from './exceptions.ts';


export class ConditionVariable<T> {
	protected listeners: PromiseWithResolvers<T>[] = [];
	protected available = true;
	protected e: unknown;

	/**
	 * In JavaScript [cooperative multi-coroutine scheduling](https://en.wikipedia.org/wiki/Cooperative_multitasking), a mutex is optional because event loop cannot be switched between the condition checking and the `wait`.
	 */
	public async wait(): Promise<T> {
		if (this.available) {} else throw this.e;
		const pwr = Promise.withResolvers<T>();
		this.listeners.push(pwr);
		return await pwr.promise;
	}

	public signal(x: T): void {
		if (this.available) {} else throw this.e;
		if (this.listeners.length)
			this.listeners.shift()!.resolve(x);
	}

	public broadcast(x: T): void {
		if (this.available) {} else throw this.e;
		for (const listener of this.listeners) listener.resolve(x);
		this.listeners = [];
	}

	public [Symbol.dispose](): void {
		this.throw(new Disposed());
	}

	public throw(e: unknown): void {
		this.available = false;
		this.e = e;
		for (const listener of this.listeners) listener.reject(e);
	}
}
