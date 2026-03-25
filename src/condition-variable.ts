

export class ConditionVariable<T> {
	protected listeners: PromiseWithResolvers<T>[] = [];

	/**
	 * In JavaScript [cooperative multi-coroutine scheduling](https://en.wikipedia.org/wiki/Cooperative_multitasking), a mutex is optional because event loop cannot be switched between the condition checking and the `wait`.
	 */
	public async wait(): Promise<T> {
		const pwr = Promise.withResolvers<T>();
		this.listeners.push(pwr);
		return await pwr.promise;
	}

	public signal(x: T): void {
		if (this.listeners.length)
			this.listeners.shift()!.resolve(x);
	}

	public broadcast(x: T): void {
		for (const listener of this.listeners) listener.resolve(x);
		this.listeners = [];
	}

	public unblock(e: unknown): void {
		for (const listener of this.listeners) listener.reject(e);
		this.listeners = [];
	}
}
