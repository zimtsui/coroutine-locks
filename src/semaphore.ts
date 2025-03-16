import assert from 'assert';
import { FailureToTry, Consumer } from './types.js';


export class Semaphore {
	private consumers: Consumer[] = [];
	private err: Error | null = null;

	constructor(private resources: number = 0) { }

	private refresh(): void {
		if (this.resources && this.consumers.length) {
			this.consumers.pop()!.resolve();
			this.resources--;
		}
	}

	public async p(): Promise<void> {
		assert(!this.err, <Error>this.err);
		const p = new Promise<void>((resolve, reject) => {
			this.consumers.push({resolve, reject});
		});
		this.refresh();
		return await p;
	}

	/**
	 * @throws {@link FailureToTry}
	 */
	public tryp(): void {
		assert(!this.err, <Error>this.err);
		assert(this.resources, new FailureToTry());
		this.resources--;
	}

	public v(): void {
		assert(!this.err, <Error>this.err);
		this.resources++;
		this.refresh();
	}

	public throw(err: Error): void {
		this.err = err;
		for (const consumer of this.consumers) consumer.reject(err);
		this.consumers = [];
	}
}
