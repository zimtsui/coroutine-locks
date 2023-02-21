"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = void 0;
const finite_semaphore_1 = require("./finite-semaphore");
class Mutex {
    constructor(locked = false) {
        this.finsem = new finite_semaphore_1.FiniteSemaphore(locked ? 0 : 1, 1);
    }
    /**
     * @async
     * @throws {@link TryError}
     */
    async lock() {
        await this.finsem.p();
    }
    /**
     * @throws {@link TryError}
     */
    trylock() {
        this.finsem.tryP();
    }
    /**
     * @throws {@link TryError}
     */
    unlock() {
        this.finsem.tryV();
    }
    throw(err) {
        this.finsem.throw(err);
    }
}
exports.Mutex = Mutex;
//# sourceMappingURL=mutex.js.map