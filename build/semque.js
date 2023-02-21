"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semque = void 0;
const deque_1 = require("@zimtsui/deque");
const finite_semaphore_1 = require("./finite-semaphore");
class Semque {
    constructor(resources = [], capacity = Number.POSITIVE_INFINITY) {
        this.finsem = new finite_semaphore_1.FiniteSemaphore(resources.length, capacity);
        this.deque = new deque_1.Deque(resources);
    }
    /**
     * @async
     * @throws {@link TryError}
     */
    async push(x) {
        await this.finsem.v();
        this.deque.push(x);
    }
    /**
     * @throws {@link TryError}
     */
    tryPush(x) {
        this.finsem.tryV();
        this.deque.push(x);
    }
    /**
     * @async
     * @throws {@link TryError}
     */
    async pop() {
        await this.finsem.p();
        return this.deque.pop();
    }
    /**
     * @throws {@link TryError}
     */
    tryPop() {
        this.finsem.tryP();
        return this.deque.pop();
    }
    throw(err) {
        this.finsem.throw(err);
    }
}
exports.Semque = Semque;
//# sourceMappingURL=semque.js.map