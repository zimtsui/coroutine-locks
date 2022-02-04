"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semaphore = void 0;
const chai = require("chai");
const { assert } = chai;
class Semaphore {
    constructor(resourceCount = 0) {
        this.resourceCount = resourceCount;
        this.coroutines = [];
    }
    refresh() {
        if (this.resourceCount && this.coroutines.length) {
            this.coroutines.pop()();
            this.resourceCount--;
        }
    }
    async p() {
        await new Promise(resolve => {
            this.coroutines.push(resolve);
            this.refresh();
        });
    }
    tryp() {
        assert(this.resourceCount, 'No resource.');
        this.resourceCount--;
    }
    v() {
        this.resourceCount++;
        this.refresh();
    }
}
exports.Semaphore = Semaphore;
//# sourceMappingURL=semaphore.js.map