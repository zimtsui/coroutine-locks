"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionVariable = void 0;
class ConditionVariable {
    constructor() {
        this.coroutines = [];
    }
    async wait(mutex) {
        mutex.unlock();
        await new Promise(resolve => {
            this.coroutines.push(resolve);
        });
        await mutex.lock();
    }
    signal() {
        if (this.coroutines.length)
            this.coroutines.pop()();
    }
    broadcast() {
        const coroutines = this.coroutines;
        this.coroutines = [];
        coroutines.forEach(coroutine => coroutine());
    }
}
exports.ConditionVariable = ConditionVariable;
//# sourceMappingURL=condition-variable.js.map