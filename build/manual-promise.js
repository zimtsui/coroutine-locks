"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualPromise = void 0;
const events_1 = require("events");
const autobind_decorator_1 = require("autobind-decorator");
class ManualPromise {
    constructor() {
        this.ee = new events_1.EventEmitter();
        this.native = (0, events_1.once)(this.ee, 'resolve').then(([promise]) => promise);
    }
    /**
     *  @decorator `@boundMethod`
     */
    resolve(value) {
        this.ee.emit('resolve', value);
    }
    /**
     *  @decorator `@boundMethod`
     */
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
__decorate([
    autobind_decorator_1.boundMethod
], ManualPromise.prototype, "resolve", null);
__decorate([
    autobind_decorator_1.boundMethod
], ManualPromise.prototype, "reject", null);
exports.ManualPromise = ManualPromise;
//# sourceMappingURL=manual-promise.js.map