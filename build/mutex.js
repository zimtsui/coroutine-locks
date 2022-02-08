"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = void 0;
const assert_1 = require("./assert");
class Mutex {
    constructor(locked = false) {
        this.locked = locked;
        this.coroutines = [];
    }
    refresh() {
        if (!this.locked && this.coroutines.length) {
            this.coroutines.pop().resolve();
            this.locked = true;
        }
    }
    async lock() {
        await new Promise((resolve, reject) => {
            this.coroutines.push({ resolve, reject });
            this.refresh();
        });
    }
    trylock() {
        (0, assert_1.assert)(!this.lock, 'Already locked.');
        this.locked = true;
    }
    unlock() {
        (0, assert_1.assert)(this.lock);
        this.locked = false;
        this.refresh();
    }
    throw(err) {
        for (const { reject } of this.coroutines)
            reject(err);
        this.coroutines = [];
    }
}
exports.Mutex = Mutex;
//# sourceMappingURL=mutex.js.map