"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteReadLock = void 0;
const read_write_lock_1 = require("./read-write-lock");
/**
 * Write read lock - Write priority
 */
class WriteReadLock extends read_write_lock_1.ReadWriteLock {
    refresh() {
        if (this.writing)
            return;
        if (!this.writers.length) {
            this.reading += this.readers.length;
            for (const { resolve } of this.readers)
                resolve();
            this.readers = [];
        }
        else if (!this.reading) {
            this.writers.pop().resolve();
            this.writing = true;
        }
    }
}
exports.WriteReadLock = WriteReadLock;
//# sourceMappingURL=write-read-lock.js.map