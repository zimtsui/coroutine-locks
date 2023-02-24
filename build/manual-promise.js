"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualPromise = void 0;
const events_1 = require("events");
class ManualPromise {
    constructor() {
        this.ee = new events_1.EventEmitter();
        this.native = (0, events_1.once)(this.ee, 'resolve').then(([promise]) => promise);
    }
    resolve(value) {
        this.ee.emit('resolve', value);
    }
    reject(reason) {
        this.ee.emit('resolve', Promise.reject(reason));
    }
    then(onFulfilled, onRejected) {
        return this.native.then(onFulfilled, onRejected);
    }
    catch(onRejected) {
        return this.native.then(x => x, onRejected);
    }
    finally(onFinally) {
        return this.then(onFinally, onFinally)
            .then(() => this);
    }
}
exports.ManualPromise = ManualPromise;
//# sourceMappingURL=manual-promise.js.map