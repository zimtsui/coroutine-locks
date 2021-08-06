"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semaphore = void 0;
class Semaphore {
    constructor(resourceCount = 0) {
        this.resourceCount = resourceCount;
        this.coroutines = [];
    }
    refresh() {
        if (this.resourceCount === 0)
            return;
        if (!this.coroutines.length)
            return;
        this.coroutines.pop()();
        this.resourceCount--;
    }
    async p() {
        await new Promise(resolve => {
            this.coroutines.push(resolve);
            this.refresh();
        });
    }
    v() {
        this.resourceCount++;
        this.refresh();
    }
}
exports.Semaphore = Semaphore;
//# sourceMappingURL=semaphore.js.map