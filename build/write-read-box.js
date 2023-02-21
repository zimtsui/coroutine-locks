"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteReadBox = void 0;
const write_read_lock_1 = require("./write-read-lock");
class WriteReadBox {
    constructor(x) {
        this.x = x;
        this.lock = new write_read_lock_1.WriteReadLock();
    }
    async readLock() {
        await this.lock.readLock();
        return this.x;
    }
    tryReadLock() {
        this.lock.tryReadLock();
        return this.x;
    }
    async writeLock() {
        await this.lock.writeLock();
        return this.x;
    }
    tryWriteLock() {
        this.lock.tryWriteLock();
        return this.x;
    }
    /**
     * @throws {@link TryError}
     */
    readUnlock() {
        this.lock.readUnlock();
    }
    /**
     * @throws {@link TryError}
     */
    writeUnlock(x) {
        this.lock.writeUnlock();
        this.x = x;
    }
    throw(err) {
        this.lock.throw(err);
    }
}
exports.WriteReadBox = WriteReadBox;
//# sourceMappingURL=write-read-box.js.map