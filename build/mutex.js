"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = void 0;
const chai = require("chai");
const { assert } = chai;
class Mutex {
    constructor(locked = false) {
        this.locked = locked;
        this.coroutines = [];
    }
    refresh() {
        if (!this.locked && this.coroutines.length) {
            this.coroutines.pop()();
            this.locked = true;
        }
    }
    async lock() {
        await new Promise(resolve => {
            this.coroutines.push(resolve);
            this.refresh();
        });
    }
    trylock() {
        assert(!this.lock, 'Already locked.');
        this.locked = true;
    }
    unlock() {
        this.locked = false;
        this.refresh();
    }
}
exports.Mutex = Mutex;
//# sourceMappingURL=mutex.js.map