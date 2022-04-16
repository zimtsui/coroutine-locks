import { ManualPromise } from 'manual-promise';
export declare class PublicManualPromise extends ManualPromise {
    resolve: (value: void) => void;
    reject: (err: Error) => void;
}
