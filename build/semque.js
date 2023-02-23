"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semque = void 0;
const deque_1 = require("@zimtsui/deque");
const finite_semaphore_1 = require("./finite-semaphore");
class Semque {
    constructor(resources = [], capacity = Number.POSITIVE_INFINITY) {
        this.finisem = new finite_semaphore_1.FiniteSemaphore(resources.length, capacity);
        this.deque = new deque_1.Deque(resources);
    }
    async push(x) {
        await this.finisem.v();
        this.deque.push(x);
    }
    tryPush(x) {
        this.finisem.tryV();
        this.deque.push(x);
    }
    async pop() {
        await this.finisem.p();
        return this.deque.pop();
    }
    tryPop() {
        this.finisem.tryP();
        return this.deque.pop();
    }
    throw(err) {
        this.finisem.throw(err);
    }
}
exports.Semque = Semque;
//# sourceMappingURL=semque.js.map