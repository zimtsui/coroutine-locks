import { assert } from './assert';
import { Pair } from './pair';

export class Mutex {
    private coroutines: Pair[] = [];

    constructor(private locked = false) { }

    private refresh(): void {
        if (!this.locked && this.coroutines.length) {
            this.coroutines.pop()!.resolve();
            this.locked = true;
        }
    }

    public async lock(): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.coroutines.push({ resolve, reject });
            this.refresh();
        });
    }

    public trylock(): void {
        assert(!this.lock, 'Already locked.');
        this.locked = true;
    }

    public unlock(): void {
        assert(this.lock);
        this.locked = false;
        this.refresh();
    }

    public throw(err: Error): void {
        for (const { reject } of this.coroutines) reject(err);
        this.coroutines = [];
    }
}
