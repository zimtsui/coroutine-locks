"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = void 0;
class Mutex {
    constructor() {
        this.coroutines = [];
        this.locked = false;
    }
    refresh() {
        if (this.locked)
            return;
        if (!this.coroutines.length)
            return;
        this.locked = true;
        const coroutine = this.coroutines.pop();
        coroutine();
    }
    async lock() {
        await new Promise(resolve => {
            this.coroutines.push(resolve);
            this.refresh();
        });
    }
    unlock() {
        this.locked = false;
        this.refresh();
    }
}
exports.Mutex = Mutex;
//# sourceMappingURL=mutex.js.map