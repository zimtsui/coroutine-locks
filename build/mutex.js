"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = void 0;
const assert = require("assert");
const manual_promise_1 = require("@zimtsui/manual-promise");
const exceptions_1 = require("./exceptions");
class Mutex {
    constructor(locked = false) {
        this.locked = locked;
        this.users = [];
        this.err = null;
    }
    refresh() {
        if (!this.locked && this.users.length) {
            this.users.pop().resolve();
            this.locked = true;
        }
    }
    async lock() {
        assert(this.err === null, this.err);
        const user = new manual_promise_1.ManualPromise();
        this.users.push(user);
        this.refresh();
        await user;
    }
    /**
     * @throws {@link TryLockError}
     */
    trylock() {
        assert(this.err === null, this.err);
        assert(!this.lock, new exceptions_1.TryLockError());
        this.locked = true;
    }
    unlock() {
        assert(this.err === null, this.err);
        assert(this.lock);
        this.locked = false;
        this.refresh();
    }
    throw(err) {
        for (const user of this.users)
            user.reject(err);
        this.users = [];
        this.err = err;
    }
}
exports.Mutex = Mutex;
//# sourceMappingURL=mutex.js.map