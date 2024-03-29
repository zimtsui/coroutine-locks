import assert = require("assert");
import { Semaphore } from "./semaphore";
import { TryError } from "./exceptions";


export class FiniteSemaphore {
	private used: Semaphore;
	private unused: Semaphore;

	public constructor(
		resourceCount = 0,
		capacity = Number.POSITIVE_INFINITY,
	) {
		assert(capacity >= resourceCount);
		this.used = new Semaphore(resourceCount);
		this.unused = new Semaphore(capacity - resourceCount);
	}

	public async v(): Promise<void> {
		await this.unused.p();
		this.used.v();
	}

	public tryV(): void {
		this.unused.tryp();
		this.used.v();
	}

	public async p(): Promise<void> {
		await this.used.p();
		this.unused.v();
	}

	public tryP(): void {
		this.used.tryp();
		this.unused.v();
	}

	public throw(err: Error): void {
		this.used.throw(err);
		this.unused.throw(err);
	}
}
