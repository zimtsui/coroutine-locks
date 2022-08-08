import assert = require('assert');
import { PublicManualPromise } from '@zimtsui/manual-promise';
import { TryLockError } from './errors';


export class Mutex {
    private users: PublicManualPromise<void>[] = [];

    constructor(private locked = false) { }

    private refresh(): void {
        if (!this.locked && this.users.length) {
            this.users.pop()!.resolve();
            this.locked = true;
        }
    }

    public async lock(): Promise<void> {
        const user = new PublicManualPromise<void>();
        this.users.push(user);
        this.refresh();
        await user;
    }

    /**
     * @throws {@link TryLockError}
     */
    public trylock(): void {
        assert(
            !this.lock,
            new TryLockError(),
        );
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
