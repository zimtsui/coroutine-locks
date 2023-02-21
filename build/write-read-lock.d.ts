import { ReadWriteLock } from './read-write-lock';
/**
 * Write read lock - Write priority
 */
export declare class WriteReadLock extends ReadWriteLock {
    protected refresh(): void;
}
