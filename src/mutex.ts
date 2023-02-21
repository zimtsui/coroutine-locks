import { TryError } from './exceptions';
import { FiniteSemaphore } from './bisemaphore';


export class Mutex {
    private finsem: FiniteSemaphore;

    constructor(locked = false) {
        this.finsem = new FiniteSemaphore(locked ? 0 : 1, 1);
    }

    public async lock(): Promise<void> {
        await this.finsem.p();
    }

    /**
     * @throws {@link TryError}
     */
    public trylock(): void {
        this.finsem.tryP();
    }

    public unlock(): void {
        this.finsem.tryV();
    }

    public throw(err: Error): void {
        this.finsem.throw(err);
    }
}
