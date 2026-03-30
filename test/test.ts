import test from 'ava';
import {
    ConditionVariable,
    FiniteSemaphore,
    Mutex,
    RWLock,
    Semaphore,
    StateError,
    WRLock,
} from '@zimtsui/typelocks';


function timeout(ms: number): Promise<'timeout'> {
    return new Promise(resolve => setTimeout(() => resolve('timeout'), ms));
}

async function rejection<T>(promise: Promise<T>): Promise<unknown> {
    try {
        await promise;
    } catch (error) {
        return error;
    }
    throw new Error('Expected promise to reject');
}

test('Semaphore delivers queued values and unblock rejects waiters', async t => {
    const sem = new Semaphore<string>();
    const pending = sem.decrease();

    sem.increase('x');

    t.is(await pending, 'x');

    const blocked = sem.decrease();
    sem.unblock('stop');

    t.is(await rejection(blocked), 'stop');
});

test('Semaphore decreaseSync throws when empty', t => {
    const sem = new Semaphore<string>();

    t.throws(() => sem.decreaseSync(), { instanceOf: StateError });
});

test('Mutex acquire and release preserve token flow', async t => {
    const mutex = new Mutex<void>();

    t.is(mutex.isAcquired(), true);

    mutex.release();
    t.is(mutex.isAcquired(), false);

    await mutex.acquire();
    t.is(mutex.isAcquired(), true);

    t.notThrows(() => mutex.release(undefined));
    t.is(mutex.isAcquired(), false);
});

test('Mutex rejects invalid release and releaseTry ignores it', t => {
    const mutex = new Mutex<void>();

    mutex.release(undefined);

    t.throws(() => mutex.release(undefined), { instanceOf: StateError });
    t.notThrows(() => mutex.releaseTry(undefined));
});

test('ConditionVariable wait releases then reacquires mutex', async t => {
    const cv = new ConditionVariable();
    const { mutex } = cv;

    mutex.release();
    await mutex.acquire();

    const waiter = cv.wait();
    await Promise.resolve();

    t.is(mutex.isAcquired(), false);

    cv.signal();
    await waiter;

    t.is(mutex.isAcquired(), true);
});

test('ConditionVariable reacquires mutex when unblocked with error', async t => {
    const cv = new ConditionVariable();
    const { mutex } = cv;

    mutex.release();
    await mutex.acquire();

    const waiter = cv.wait();
    await Promise.resolve();

    cv.unblock('stop');

    t.is(await rejection(waiter), 'stop');
    t.is(mutex.isAcquired(), true);
});

test('FiniteSemaphore validates capacity', t => {
    t.notThrows(() => new FiniteSemaphore<string>(0));
    t.throws(() => new FiniteSemaphore<string>(-1));
    t.throws(() => new FiniteSemaphore<string>(1.5));
});

test('FiniteSemaphore blocks producer at capacity and drops cancelled pending values', async t => {
    const sem = new FiniteSemaphore<string>(1);

    await sem.increase('a');
    t.is(sem.getSize(), 1);

    const blocked = sem.increase('b');
    t.is(await Promise.race([blocked.then(() => 'resolved'), timeout(20)]), 'timeout');

    t.is(sem.decreaseSync(), 'a');
    t.is(await blocked.then(() => 'resolved'), 'resolved');
    t.is(sem.decreaseSync(), 'b');

    await sem.increase('live');

    const cancelled = sem.increase('c');
    t.is(await Promise.race([cancelled.then(() => 'resolved'), timeout(20)]), 'timeout');

    sem.unblock('stop');

    t.is(await rejection(cancelled), 'stop');
    t.is(sem.decreaseSync(), 'live');
    t.throws(() => sem.decreaseSync(), { instanceOf: StateError });
});

test('RWLock wakes waiting writer after last reader releases', async t => {
    const lock = new RWLock();

    await lock.acquireRead();

    const writer = lock.acquireWrite();
    t.is(await Promise.race([writer.then(() => 'writer'), timeout(20)]), 'timeout');

    lock.releaseRead();

    t.is(await writer.then(() => 'writer'), 'writer');
    t.is(lock.isAcquiredWrite(), true);
});

test('RWLock allows new readers even when a writer is waiting', async t => {
    const lock = new RWLock();

    await lock.acquireRead();

    const writer = lock.acquireWrite();
    const reader = lock.acquireRead();

    t.is(await reader.then(() => 'reader'), 'reader');
    t.is(await Promise.race([writer.then(() => 'writer'), timeout(20)]), 'timeout');

    lock.releaseRead();
    lock.releaseRead();

    t.is(await writer.then(() => 'writer'), 'writer');
});

test('WRLock blocks new readers while a writer is waiting', async t => {
    const lock = new WRLock();

    await lock.acquireRead();

    const writer = lock.acquireWrite();
    const reader = lock.acquireRead();

    t.is(await Promise.race([reader.then(() => 'reader'), timeout(20)]), 'timeout');

    lock.releaseRead();

    t.is(await writer.then(() => 'writer'), 'writer');
    t.is(await Promise.race([reader.then(() => 'reader'), timeout(20)]), 'timeout');

    lock.releaseWrite();

    t.is(await reader.then(() => 'reader'), 'reader');
});

test('RWLockBase switch downgrades a writer to a reader', async t => {
    const lock = new WRLock();

    await lock.acquireWrite();
    lock.switch();

    t.is(lock.isAcquiredWrite(), false);
    t.is(lock.isAcquiredRead(), true);

    lock.releaseRead();
    t.is(lock.isAcquiredRead(), false);
});
