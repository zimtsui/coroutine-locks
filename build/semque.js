"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semque = void 0;
const deque_1 = require("@zimtsui/deque");
const bisemaphore_1 = require("./bisemaphore");
class Semque {
    constructor(resources = [], capacity = Number.POSITIVE_INFINITY) {
        this.bisem = new bisemaphore_1.Bisemaphore(resources.length, capacity);
        this.deque = new deque_1.Deque(resources);
    }
    /**
     * @async
     * @throws {@link TryError}
     */
    async push(x) {
        await this.bisem.v();
        this.deque.push(x);
    }
    tryPush(x) {
        this.bisem.tryV();
        this.deque.push(x);
    }
    /**
     * @async
     * @throws {@link TryError}
     */
    async pop() {
        await this.bisem.p();
        return this.deque.pop();
    }
    tryPop() {
        this.bisem.tryP();
        return this.deque.pop();
    }
    throw(err) {
        this.bisem.throw(err);
    }
}
exports.Semque = Semque;
//# sourceMappingURL=semque.js.map