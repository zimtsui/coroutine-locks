import { Rwlock } from './rwlock';
/**
 * Write read lock - Write priority
 */
export declare class Wrlock extends Rwlock {
    protected refresh(): void;
}
