import assert from 'assert';
import { Failure } from './failure.js';
import { Consumer } from './consumer.js';



export class Semaphore {
	private consumers: Consumer[] = [];
	private error: Error | null = null;

	public constructor(private size: number = 0) { }

	public getSize(): number {
		return this.size;
	}

	private flush(): void {
		if (this.size && this.consumers.length) {
			this.consumers.shift()!.resolve();
			this.size--;
		}
	}

	public async decrease(): Promise<void> {
		assert(!this.error, this.error as Error);
		const p = new Promise<void>((resolve, reject) => {
			this.consumers.push({resolve, reject});
		});
		this.flush();
		return await p;
	}

	/**
	 * @throws {@link Failure}
	 */
	public decreaseSync(): void {
		assert(!this.error, this.error as Error);
		assert(this.size, new Failure());
		this.size--;
	}

	public increase(): void {
		assert(!this.error, this.error as Error);
		this.size++;
		this.flush();
	}

	public throw(error: Error): void {
		this.error = error;
		for (const consumer of this.consumers) consumer.reject(error);
		this.consumers = [];
	}
}
