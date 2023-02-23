"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = void 0;
const finite_semaphore_1 = require("./finite-semaphore");
class Mutex {
    constructor(locked = false) {
        this.finisem = new finite_semaphore_1.FiniteSemaphore(locked ? 0 : 1, 1);
    }
    async lock() {
        await this.finisem.p();
    }
    tryLock() {
        this.finisem.tryP();
    }
    /**
     * @throws {@link TryError}
     */
    unlock() {
        this.finisem.tryV();
    }
    throw(err) {
        this.finisem.throw(err);
    }
}
exports.Mutex = Mutex;
//# sourceMappingURL=mutex.js.map