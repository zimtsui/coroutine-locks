"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rwlock = void 0;
class Rwlock {
    constructor() {
        this.readers = [];
        this.writers = [];
        this.state = 0;
    }
    refresh() {
        if (this.state === -1)
            return;
        while (this.readers.length) {
            const reader = this.readers.pop();
            this.state++;
            reader();
        }
        if (this.state === 0 && this.writers.length) {
            const writer = this.writers.pop();
            this.state = -1;
            writer();
        }
    }
    async rlock() {
        await new Promise(resolve => {
            this.readers.push(resolve);
            this.refresh();
        });
    }
    async wlock() {
        await new Promise(resolve => {
            this.writers.push(resolve);
            this.refresh();
        });
    }
    unlock() {
        if (this.state > 0)
            this.state--;
        if (this.state === -1)
            this.state = 0;
        this.refresh();
    }
}
exports.Rwlock = Rwlock;
//# sourceMappingURL=rwlock.js.map