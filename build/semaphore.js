"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semaphore = void 0;
const assert_1 = require("./assert");
class Semaphore {
    constructor(resourceCount = 0) {
        this.resourceCount = resourceCount;
        this.coroutines = [];
    }
    refresh() {
        if (this.resourceCount && this.coroutines.length) {
            this.coroutines.pop().resolve();
            this.resourceCount--;
        }
    }
    async p() {
        await new Promise((resolve, reject) => {
            this.coroutines.push({ resolve, reject });
            this.refresh();
        });
    }
    tryp() {
        (0, assert_1.assert)(this.resourceCount, 'No resource.');
        this.resourceCount--;
    }
    v() {
        this.resourceCount++;
        this.refresh();
    }
    throw(err) {
        for (const { reject } of this.coroutines)
            reject(err);
    }
}
exports.Semaphore = Semaphore;
//# sourceMappingURL=semaphore.js.map