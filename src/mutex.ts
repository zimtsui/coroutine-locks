import assert = require('assert');
import { PublicManualPromise } from './public-manual-promise';


export class Mutex {
    private users: PublicManualPromise[] = [];

    constructor(private locked = false) { }

    private refresh(): void {
        if (!this.locked && this.users.length) {
            this.users.pop()!.resolve();
            this.locked = true;
        }
    }

    public async lock(): Promise<void> {
        const user = new PublicManualPromise();
        this.users.push(user);
        this.refresh();
        await user;
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
        for (const user of this.users) user.reject(err);
        this.users = [];
    }
}
