import assert from 'assert';
import { Failure, Consumer } from './types.js';


export class Semaphore {
	private consumers: Consumer[] = [];
	private err: Error | null = null;

	public constructor(private size: number = 0) { }

	public getSize(): number {
		return this.size;
	}

	private refresh(): void {
		if (this.size && this.consumers.length) {
			this.consumers.shift()!.resolve();
			this.size--;
		}
	}

	public async decrease(): Promise<void> {
		assert(!this.err, this.err as Error);
		const p = new Promise<void>((resolve, reject) => {
			this.consumers.push({resolve, reject});
		});
		this.refresh();
		return await p;
	}

	/**
	 * @throws {@link Failure}
	 */
	public decreaseSync(): void {
		assert(!this.err, this.err as Error);
		assert(this.size, new Failure());
		this.size--;
	}

	public increase(): void {
		assert(!this.err, this.err as Error);
		this.size++;
		this.refresh();
	}

	public throw(err: Error): void {
		this.err = err;
		for (const consumer of this.consumers) consumer.reject(err);
		this.consumers = [];
	}
}
