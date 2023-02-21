import { Deque } from '@zimtsui/deque';
import { FiniteSemaphore } from "./finite-semaphore";

export class Semque<T> {
	private deque: Deque<T>;
	private finsem: FiniteSemaphore;

	public constructor(
		resources: T[] = [],
		capacity = Number.POSITIVE_INFINITY,
	) {
		this.finsem = new FiniteSemaphore(resources.length, capacity);
		this.deque = new Deque(resources);
	}

	public async push(x: T): Promise<void> {
		await this.finsem.v();
		this.deque.push(x);
	}

	public tryPush(x: T): void {
		this.finsem.tryV();
		this.deque.push(x);
	}

	public async pop(): Promise<T> {
		await this.finsem.p();
		return this.deque.pop();
	}

	public tryPop(): T {
		this.finsem.tryP();
		return this.deque.pop();
	}

	public throw(err: Error): void {
		this.finsem.throw(err);
	}
}
