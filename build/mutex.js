"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = void 0;
const assert = require("assert");
const public_manual_promise_1 = require("./public-manual-promise");
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
        const user = new public_manual_promise_1.PublicManualPromise();
        this.users.push(user);
        this.refresh();
        await user;
    }
    trylock() {
        assert(!this.lock, 'Already locked.');
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