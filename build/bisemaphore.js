"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiniteSemaphore = void 0;
const assert = require("assert");
const semaphore_1 = require("./semaphore");
class FiniteSemaphore {
    constructor(resourceCount = 0, capacity = Number.POSITIVE_INFINITY) {
        assert(capacity >= resourceCount);
        this.used = new semaphore_1.Semaphore(resourceCount);
        this.unused = new semaphore_1.Semaphore(capacity - resourceCount);
    }
    /**
     * @async
     * @throws {@link TryError}
     */
    async v() {
        await this.unused.p();
        this.used.v();
    }
    /**
     * @throws {@link TryError}
     */
    tryV() {
        this.unused.tryp();
        this.used.v();
    }
    /**
     * @async
     * @throws {@link TryError}
     */
    async p() {
        await this.used.p();
        this.unused.v();
    }
    /**
     * @throws {@link TryError}
     */
    tryP() {
        this.used.tryp();
        this.unused.v();
    }
    throw(err) {
        this.used.throw(err);
        this.unused.throw(err);
    }
}
exports.FiniteSemaphore = FiniteSemaphore;
//# sourceMappingURL=bisemaphore.js.map