import { TryError } from './exceptions';
import { FiniteSemaphore } from './finite-semaphore';


export class Mutex {
    private finsem: FiniteSemaphore;

    constructor(locked = false) {
        this.finsem = new FiniteSemaphore(locked ? 0 : 1, 1);
    }

    /**
     * @async
     * @throws {@link TryError}
     */
    public async lock(): Promise<void> {
        await this.finsem.p();
    }

    /**
     * @throws {@link TryError}
     */
    public trylock(): void {
        this.finsem.tryP();
    }

    /**
     * @throws {@link TryError}
     */
    public unlock(): void {
        this.finsem.tryV();
    }

    public throw(err: Error): void {
        this.finsem.throw(err);
    }
}
