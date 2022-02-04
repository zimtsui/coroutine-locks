"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rwlock = void 0;
const chai = require("chai");
const { assert } = chai;
class Rwlock {
    constructor() {
        this.readers = [];
        this.writers = [];
        this.reading = 0;
        this.writing = false;
    }
    refresh() {
        if (this.writing)
            return;
        this.reading += this.readers.length;
        for (const reader of this.readers)
            reader();
        this.readers = [];
        if (!this.reading && this.writers.length) {
            this.writers.pop()();
            this.writing = true;
        }
    }
    async rdlock() {
        await new Promise(resolve => {
            this.readers.push(resolve);
            this.refresh();
        });
    }
    tryrdlock() {
        assert(!this.writing, 'Already write locked.');
        this.reading++;
    }
    async wrlock() {
        await new Promise(resolve => {
            this.writers.push(resolve);
            this.refresh();
        });
    }
    trywrlock() {
        assert(!this.reading, 'Already read locked');
        assert(!this.writing, 'Already write locked');
        this.writing = true;
    }
    unlock() {
        if (this.reading)
            this.reading--;
        if (this.writing)
            this.writing = false;
        this.refresh();
    }
}
exports.Rwlock = Rwlock;
//# sourceMappingURL=rwlock.js.map