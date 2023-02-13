"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionVariable = void 0;
const manual_promise_1 = require("@zimtsui/manual-promise");
const assert = require("assert");
class ConditionVariable {
    constructor() {
        this.listeners = [];
        this.err = null;
    }
    /**
     * In JavaScript [cooperative multi-coroutine scheduling](https://en.wikipedia.org/wiki/Cooperative_multitasking), a mutex is optional because event loop cannot be switched between the condition checking and the `wait`.
     */
    async wait(mutex) {
        assert(this.err === null, this.err);
        if (mutex)
            mutex.unlock();
        const listener = new manual_promise_1.ManualPromise();
        this.listeners.push(listener);
        await listener;
        if (mutex)
            await mutex.lock();
    }
    signal() {
        assert(this.err === null, this.err);
        if (this.listeners.length)
            this.listeners.pop().resolve();
    }
    broadcast() {
        assert(this.err === null, this.err);
        for (const listener of this.listeners)
            listener.resolve();
        this.listeners = [];
    }
    throw(err) {
        for (const listener of this.listeners)
            listener.reject(err);
        this.listeners = [];
        this.err = err;
    }
}
exports.ConditionVariable = ConditionVariable;
//# sourceMappingURL=condition-variable.js.map