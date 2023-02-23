import { Deque } from '@zimtsui/deque';
import { FiniteSemaphore } from "./finite-semaphore";

export class Semque<T> {
	private deque: Deque<T>;
	private finisem: FiniteSemaphore;

	public constructor(
		resources: T[] = [],
		capacity = Number.POSITIVE_INFINITY,
	) {
		this.finisem = new FiniteSemaphore(resources.length, capacity);
		this.deque = new Deque(resources);
	}

	public async push(x: T): Promise<void> {
		await this.finisem.v();
		this.deque.push(x);
	}

	public tryPush(x: T): void {
		this.finisem.tryV();
		this.deque.push(x);
	}

	public async pop(): Promise<T> {
		await this.finisem.p();
		return this.deque.pop();
	}

	public tryPop(): T {
		this.finisem.tryP();
		return this.deque.pop();
	}

	public throw(err: Error): void {
		this.finisem.throw(err);
	}
}
