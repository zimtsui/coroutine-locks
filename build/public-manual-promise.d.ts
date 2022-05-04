import { ManualPromise } from 'manual-promise';
export declare class PublicManualPromise extends ManualPromise<void> {
    resolve: (value: void) => void;
    reject: (err: Error) => void;
}
