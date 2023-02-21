"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = void 0;
const bisemaphore_1 = require("./bisemaphore");
class Mutex {
    constructor(locked = false) {
        this.finsem = new bisemaphore_1.FiniteSemaphore(locked ? 0 : 1, 1);
    }
    async lock() {
        await this.finsem.p();
    }
    /**
     * @throws {@link TryError}
     */
    trylock() {
        this.finsem.tryP();
    }
    unlock() {
        this.finsem.tryV();
    }
    throw(err) {
        this.finsem.throw(err);
    }
}
exports.Mutex = Mutex;
//# sourceMappingURL=mutex.js.map