import { Deque } from '@zimtsui/deque';
import { Bisemaphore } from "./bisemaphore";

export class Semque<T> {
	private deque: Deque<T>;
	private bisem: Bisemaphore;

	public constructor(
		resources: T[] = [],
		capacity = Number.POSITIVE_INFINITY,
	) {
		this.bisem = new Bisemaphore(resources.length, capacity);
		this.deque = new Deque(resources);
	}

	/**
	 * @async
	 * @throws {@link TryError}
	 */
	public async push(x: T): Promise<void> {
		await this.bisem.v();
		this.deque.push(x);
	}

	public tryPush(x: T): void {
		this.bisem.tryV();
		this.deque.push(x);
	}

	/**
	 * @async
	 * @throws {@link TryError}
	 */
	public async pop(): Promise<T> {
		await this.bisem.p();
		return this.deque.pop();
	}

	public tryPop(): T {
		this.bisem.tryP();
		return this.deque.pop();
	}

	public throw(err: Error): void {
		this.bisem.throw(err);
	}
}
