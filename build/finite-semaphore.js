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
    async v() {
        await this.unused.p();
        this.used.v();
    }
    tryV() {
        this.unused.tryp();
        this.used.v();
    }
    async p() {
        await this.used.p();
        this.unused.v();
    }
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
//# sourceMappingURL=finite-semaphore.js.map