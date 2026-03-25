import test from 'ava';
import {
    ConditionVariable,
    StateError,
    FiniteSemaphore,
    Mutex,
    RWLock,
    Semaphore,
    WRLock,
} from '@zimtsui/coroutine-locks';
import { EventBuffer } from '@zimtsui/coroutine-locks/buffering';


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

test('RWLock wakes waiting writer after last reader releases', async t => {
    const lock = new RWLock();

    await lock.acquireRead();
    const writer = lock.acquireWrite();

    t.is(await Promise.race([writer.then(() => 'writer'), timeout(20)]), 'timeout');

    lock.releaseRead();
    t.is(await writer.then(() => 'writer'), 'writer');
    t.is(lock.isAcquiredWrite(), true);
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

test('ConditionVariable wait releases then reacquires mutex', async t => {
    const mutex = new Mutex<void>();
    const cv = new ConditionVariable();

    mutex.release();
    await mutex.acquire();

    const waiter = cv.wait(mutex);
    await Promise.resolve();

    t.is(mutex.isAcquired(), false);

    cv.signal();
    await waiter;

    t.is(mutex.isAcquired(), true);
});

test('ConditionVariable reacquires mutex when unblocked with error', async t => {
    const mutex = new Mutex<void>();
    const cv = new ConditionVariable();

    mutex.release();
    await mutex.acquire();

    const waiter = cv.wait(mutex);
    await Promise.resolve();
    cv.unblock('stop');

    t.is(await rejection(waiter), 'stop');
    t.is(mutex.isAcquired(), true);
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

test('EventBuffer ends a pending consumer after dispose', async t => {
    const buffer = new EventBuffer<string>();

    buffer.push('a');
    t.deepEqual(await buffer.next(), { done: false, value: 'a' });

    const pending = buffer.next();
    buffer[Symbol.dispose]();
    t.deepEqual(await pending, { done: true, value: undefined });
});
