import { TryError } from './exceptions';
import { Bisemaphore } from './bisemaphore';


export class Mutex {
    private bisem: Bisemaphore;

    constructor(locked = false) {
        this.bisem = new Bisemaphore(locked ? 0 : 1, 1);
    }

    public async lock(): Promise<void> {
        await this.bisem.p();
    }

    /**
     * @throws {@link TryError}
     */
    public trylock(): void {
        this.bisem.tryP();
    }

    public unlock(): void {
        this.bisem.tryV();
    }

    public throw(err: Error): void {
        this.bisem.throw(err);
    }
}
