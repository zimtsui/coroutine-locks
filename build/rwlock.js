"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rwlock = void 0;
const assert = require("assert");
const manual_promise_1 = require("@zimtsui/manual-promise");
const errors_1 = require("./errors");
/**
 * Read write lock - Write starvation
 */
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
        const reader = new manual_promise_1.PublicManualPromise();
        this.readers.push(reader);
        this.refresh();
        await reader;
    }
    /**
     * @throws {@link TryLockError}
     */
    tryrdlock() {
        assert(!this.writing, new errors_1.TryLockError());
        this.reading++;
    }
    async wrlock() {
        const writer = new manual_promise_1.PublicManualPromise();
        this.writers.push(writer);
        this.refresh();
        await writer;
    }
    /**
     * @throws {@link TryLockError}
     */
    trywrlock() {
        assert(!this.reading, new errors_1.TryLockError());
        assert(!this.writing, new errors_1.TryLockError());
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