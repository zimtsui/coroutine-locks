import { TryError } from './exceptions';
import { FiniteSemaphore } from './finite-semaphore';


export class Mutex {
    private finisem: FiniteSemaphore;

    constructor(locked = false) {
        this.finisem = new FiniteSemaphore(locked ? 0 : 1, 1);
    }

    public async lock(): Promise<void> {
        await this.finisem.p();
    }

    public tryLock(): void {
        this.finisem.tryP();
    }

    /**
     * @throws {@link TryError}
     */
    public unlock(): void {
        this.finisem.tryV();
    }

    public throw(err: Error): void {
        this.finisem.throw(err);
    }
}
