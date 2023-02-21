"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = void 0;
const bisemaphore_1 = require("./bisemaphore");
class Mutex {
    constructor(locked = false) {
        this.bisem = new bisemaphore_1.Bisemaphore(locked ? 0 : 1, 1);
    }
    async lock() {
        await this.bisem.p();
    }
    /**
     * @throws {@link TryError}
     */
    trylock() {
        this.bisem.tryP();
    }
    unlock() {
        this.bisem.tryV();
    }
    throw(err) {
        this.bisem.throw(err);
    }
}
exports.Mutex = Mutex;
//# sourceMappingURL=mutex.js.map