"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semaphore = void 0;
const assert = require("assert");
const manual_promise_1 = require("@zimtsui/manual-promise");
const errors_1 = require("./errors");
class Semaphore {
    constructor(resourceCount = 0) {
        this.resourceCount = resourceCount;
        this.consumers = [];
    }
    refresh() {
        if (this.resourceCount && this.consumers.length) {
            this.consumers.pop().resolve();
            this.resourceCount--;
        }
    }
    async p() {
        const consumer = new manual_promise_1.PublicManualPromise();
        this.consumers.push(consumer);
        this.refresh();
        await consumer;
    }
    /**
     * @throws {@link TryLockError}
     */
    tryp() {
        assert(this.resourceCount, new errors_1.TryLockError());
        this.resourceCount--;
    }
    v() {
        this.resourceCount++;
        this.refresh();
    }
    throw(err) {
        for (const consumer of this.consumers)
            consumer.reject(err);
        this.consumers = [];
    }
}
exports.Semaphore = Semaphore;
//# sourceMappingURL=semaphore.js.map