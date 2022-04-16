"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rwlock = void 0;
const assert = require("assert");
const public_manual_promise_1 = require("./public-manual-promise");
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
            reader.resolve();
        this.readers = [];
        if (!this.reading && this.writers.length) {
            this.writers.pop().resolve();
            this.writing = true;
        }
    }
    async rdlock() {
        const reader = new public_manual_promise_1.PublicManualPromise();
        this.readers.push(reader);
        this.refresh();
        await reader;
    }
    tryrdlock() {
        assert(!this.writing, 'Already write locked.');
        this.reading++;
    }
    async wrlock() {
        const writer = new public_manual_promise_1.PublicManualPromise();
        this.writers.push(writer);
        this.refresh();
        await writer;
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
    throw(err) {
        for (const reader of this.readers)
            reader.reject(err);
        this.readers = [];
        for (const writer of this.writers)
            writer.reject(err);
        this.writers = [];
    }
}
exports.Rwlock = Rwlock;
//# sourceMappingURL=rwlock.js.map