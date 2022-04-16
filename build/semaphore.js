"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semaphore = void 0;
const assert = require("assert");
const public_manual_promise_1 = require("./public-manual-promise");
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
        const consumer = new public_manual_promise_1.PublicManualPromise();
        this.consumers.push(consumer);
        this.refresh();
        await consumer;
    }
    tryp() {
        assert(this.resourceCount, 'No resource.');
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