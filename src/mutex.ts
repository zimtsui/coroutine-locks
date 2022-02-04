import chai = require('chai');
const { assert } = chai;

export class Mutex {
    private coroutines: (() => void)[] = [];

    constructor(private locked = false) { }

    private refresh(): void {
        if (!this.locked && this.coroutines.length) {
            this.coroutines.pop()!();
            this.locked = true;
        }
    }

    public async lock(): Promise<void> {
        await new Promise<void>(resolve => {
            this.coroutines.push(resolve);
            this.refresh();
        });
    }

    public trylock(): void {
        assert(!this.lock, 'Already locked.');
        this.locked = true;
    }

    public unlock(): void {
        this.locked = false;
        this.refresh();
    }
}
