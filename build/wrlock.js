"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wrlock = void 0;
const rwlock_1 = require("./rwlock");
/**
 * Write read lock - Write priority
 */
class Wrlock extends rwlock_1.Rwlock {
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
exports.Wrlock = Wrlock;
//# sourceMappingURL=wrlock.js.map