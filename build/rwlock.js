"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rwlock = void 0;
const assert_1 = require("./assert");
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
        for (const { resolve } of this.readers)
            resolve();
        this.readers = [];
        if (!this.reading && this.writers.length) {
            this.writers.pop().resolve();
            this.writing = true;
        }
    }
    async rdlock() {
        await new Promise((resolve, reject) => {
            this.readers.push({ resolve, reject });
            this.refresh();
        });
    }
    tryrdlock() {
        (0, assert_1.assert)(!this.writing, 'Already write locked.');
        this.reading++;
    }
    async wrlock() {
        await new Promise((resolve, reject) => {
            this.writers.push({ resolve, reject });
            this.refresh();
        });
    }
    trywrlock() {
        (0, assert_1.assert)(!this.reading, 'Already read locked');
        (0, assert_1.assert)(!this.writing, 'Already write locked');
        this.writing = true;
    }
    unlock() {
        if (this.reading)
            this.reading--;
        if (this.writing)
            this.writing = false;
        this.refresh();
    }
    throw(err) {
        for (const { reject } of this.readers)
            reject(err);
        this.readers = [];
        for (const { reject } of this.writers)
            reject(err);
        this.writers = [];
    }
}
exports.Rwlock = Rwlock;
//# sourceMappingURL=rwlock.js.map