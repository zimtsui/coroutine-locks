import { StateError } from './failure.ts';
import { Consumer } from './consumer.ts';



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
		if (this.error) throw this.error as Error;
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
		if (this.error) throw this.error as Error;
		if (this.size) {} else throw new StateError();
		this.size--;
	}

	public increase(): void {
		if (this.error) throw this.error as Error;
		this.size++;
		this.flush();
	}

	public throw(error: Error): void {
		this.error = error;
		for (const consumer of this.consumers) consumer.reject(error);
		this.consumers = [];
	}
}
