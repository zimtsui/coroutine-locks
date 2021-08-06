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
        await new Promise(resolve => {
            this.coroutines.push(resolve);
        });
        if (mutex)
            await mutex.lock();
    }
    signal() {
        if (this.coroutines.length)
            this.coroutines.pop()();
    }
    broadcast() {
        this.coroutines.forEach(coroutine => coroutine());
        this.coroutines = [];
    }
}
exports.ConditionVariable = ConditionVariable;
//# sourceMappingURL=condition-variable.js.map