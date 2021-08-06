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
        this.readers.forEach(reader => {
            reader();
            this.state++;
        });
        this.readers = [];
        if (this.state === 0 && this.writers.length) {
            this.writers.pop()();
            this.state = -1;
        }
    }
    async rlock() {
        await new Promise(resolve => {
            this.readers.push(resolve);
            this.refresh();
        });
    }
    tryrlock() {
        if (this.state === -1)
            throw new Error('Already wlocked.');
        this.state++;
    }
    async wlock() {
        await new Promise(resolve => {
            this.writers.push(resolve);
            this.refresh();
        });
    }
    trywlock() {
        if (this.state > 0)
            throw new Error('Already rlocked');
        if (this.state === -1)
            throw new Error('Already wlocked');
        this.state = -1;
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