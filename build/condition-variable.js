"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionVariable = void 0;
const public_manual_promise_1 = require("./public-manual-promise");
class ConditionVariable {
    constructor() {
        this.listeners = [];
    }
    async wait(mutex) {
        if (mutex)
            mutex.unlock();
        const listener = new public_manual_promise_1.PublicManualPromise();
        this.listeners.push(listener);
        await listener;
        if (mutex)
            await mutex.lock();
    }
    signal() {
        if (this.listeners.length)
            this.listeners.pop().resolve();
    }
    broadcast() {
        for (const listener of this.listeners)
            listener.resolve();
        this.listeners = [];
    }
    throw(err) {
        for (const listener of this.listeners)
            listener.reject(err);
        this.listeners = [];
    }
}
exports.ConditionVariable = ConditionVariable;
//# sourceMappingURL=condition-variable.js.map