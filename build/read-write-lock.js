"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadWriteLock = void 0;
const assert = require("assert");
const manual_promise_1 = require("@zimtsui/manual-promise");
const exceptions_1 = require("./exceptions");
/**
 * Read write lock - Write starvation
 */
class ReadWriteLock {
    constructor() {
        this.readers = [];
        this.writers = [];
        this.reading = 0;
        this.writing = false;
        this.err = null;
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
    async readLock() {
        assert(this.err === null, this.err);
        const reader = new manual_promise_1.ManualPromise();
        this.readers.push(reader);
        this.refresh();
        await reader;
    }
    tryReadLock() {
        assert(this.err === null, this.err);
        assert(!this.writing, new exceptions_1.TryError());
        this.reading++;
    }
    async writeLock() {
        assert(this.err === null, this.err);
        const writer = new manual_promise_1.ManualPromise();
        this.writers.push(writer);
        this.refresh();
        await writer;
    }
    tryWriteLock() {
        assert(this.err === null, this.err);
        assert(!this.reading, new exceptions_1.TryError());
        assert(!this.writing, new exceptions_1.TryError());
        this.writing = true;
    }
    /**
     * @throws {@link TryError} Not read locked yet.
     */
    readUnlock() {
        assert(this.err === null, this.err);
        assert(this.reading, new exceptions_1.TryError());
        this.reading--;
        this.refresh();
    }
    /**
     * @throws {@link TryError} Not write locked yet.
     */
    writeUnlock() {
        assert(this.err === null, this.err);
        assert(this.writing, new exceptions_1.TryError());
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
        this.err = err;
    }
}
exports.ReadWriteLock = ReadWriteLock;
//# sourceMappingURL=read-write-lock.js.map