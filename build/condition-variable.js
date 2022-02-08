"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionVariable = void 0;
class ConditionVariable {
    constructor() {
        this.coroutines = [];
    }
    async wait(mutex) {
        if (mutex)
            mutex.unlock();
        await new Promise((resolve, reject) => {
            this.coroutines.push({ resolve, reject });
        });
        if (mutex)
            await mutex.lock();
    }
    signal() {
        if (this.coroutines.length)
            this.coroutines.pop().resolve();
    }
    broadcast() {
        for (const { resolve } of this.coroutines)
            resolve();
        this.coroutines = [];
    }
    throw(err) {
        for (const { reject } of this.coroutines)
            reject(err);
        this.coroutines = [];
    }
}
exports.ConditionVariable = ConditionVariable;
//# sourceMappingURL=condition-variable.js.map