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
    }
    refresh() {
        if (!this.locked && this.users.length) {
            this.users.pop().resolve();
            this.locked = true;
        }
    }
    async lock() {
        const user = new manual_promise_1.ManualPromise();
        this.users.push(user);
        this.refresh();
        await user;
    }
    /**
     * @throws {@link TryLockError}
     */
    trylock() {
        assert(!this.lock, new exceptions_1.TryLockError());
        this.locked = true;
    }
    unlock() {
        assert(this.lock);
        this.locked = false;
        this.refresh();
    }
    throw(err) {
        for (const user of this.users)
            user.reject(err);
        this.users = [];
    }
}
exports.Mutex = Mutex;
//# sourceMappingURL=mutex.js.map