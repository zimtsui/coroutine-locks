/*
	当使用双信号量实现有限信号量时，协程切换时对象可能处于中间状态。

	因此不能简单地实现各种方法的同步版本。
*/
import { Semaphore } from './semaphore.ts';


export class FiniteSemaphore {
	private used: Semaphore;
	private free: Semaphore;

	public constructor(capacity: number, size = 0) {
		if (Number.isInteger(capacity) && capacity >= 0) {} else throw new Error();
		if (Number.isInteger(size) && size >= 0) {} else throw new Error();
		if (size <= capacity) {} else throw new Error();
		this.used = new Semaphore(size);
		this.free = new Semaphore(capacity - size);
	}

	public async decrease(): Promise<void> {
		await this.used.decrease();
		this.free.increase();
	}

	public async increase(): Promise<void> {
		await this.free.decrease();
		this.used.increase();
	}

	public throw(error: Error): void {
		this.used.throw(error);
		this.free.throw(error);
	}
}
