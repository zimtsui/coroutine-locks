# locks

## mutex

```ts
import { Mutex } from 'coroutine-locks';
const mutex = new Mutex();
await mutex.lock();
mutex.unlock();
```

## read-write-lock

write starvation

```ts
import { Rwlock } from 'coroutine-locks';
const rwlock = new Rwlock();
await rwlock.rlock();
await rwlock.wlock();
rwlock.unlock();
```

## write-read-lock

write priority

```ts
import { Wrlock } from 'coroutine-locks';
const wrlock = new Wrlock();
await wrlock.rlock();
await wrlock.wlock();
wrlock.unlock();
```

## semaphore

```ts
import { Semaphore } from 'coroutine-locks';
const s = new Semaphore(1);
await s.p();
s.v();
```

## condition variable

```ts
import { ConditionVariable, Mutex } from 'coroutine-locks';
const cv = new ConditionVariable();
const mutex = new Mutex();

await mutex.lock();
while (!condition) await cv.wait(mutex);
mutex.unlock();

cv.signal();
cv.broadcast();
```
