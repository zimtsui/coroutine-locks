import { EventEmitter, once } from "events";


declare module 'events' {
	export function once<T>(ee: EventEmitter, event: string | symbol): Promise<T>;
}

export class ManualPromise<T> implements PromiseLike<T> {
	private native: Promise<T>;
	private ee = new EventEmitter();

	public constructor() {
		this.native = once(this.ee, 'resolve');
		this.native.then(() => { }, () => { });
	}

	public resolve(value: T | PromiseLike<T>): void {
		this.ee.emit('resolve', value);
	}

	public reject(reason?: any): void {
		this.ee.emit('resolve', Promise.reject(reason));
	}

	public then<TResult1 = T, TResult2 = never>(
		onFulfilled: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined,
		onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined,
	): Promise<TResult1 | TResult2> {
		return this.native.then(onFulfilled, onRejected);
	}

	public catch<TResult2>(
		onRejected: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined,
	): Promise<T | TResult2> {
		return this.native.then(x => x, onRejected);
	}

	public finally(onFinally: () => void): Promise<T> {
		return this.then(onFinally, onFinally)
			.then(() => this);
	}
}
