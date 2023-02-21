"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadWriteBox = void 0;
const read_write_lock_1 = require("./read-write-lock");
class ReadWriteBox {
    constructor(x) {
        this.x = x;
        this.lock = new read_write_lock_1.ReadWriteLock();
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
    async tryWriteLock() {
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
exports.ReadWriteBox = ReadWriteBox;
//# sourceMappingURL=read-write-box.js.map