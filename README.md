# Coroutine locks

[![Npm package version](https://img.shields.io/npm/v/@zimtsui/deque?style=flat-square)](https://www.npmjs.com/package/@zimtsui/coroutine-locks)

-   Mutex
-   Read write lock
-   Write read lock
-   Semaphore
-   Condition variable
-   Finite semaphore

## Event Buffering

When you are going to transfer ongoing events following history events, use `EventBuffer` to buffer the ongoing events happening during the process of reading history events.

```ts
import { EventBuffer } from '@zimtsui/coroutine-locks/buffering';

declare function readHistoryEvents(): Promise<Event[]>;
declare const ongoingEventTarget: EventTarget;

export default async function *getEvents(): AsyncGenerator<Event, void, void> {
    using buffer = new EventBuffer<Event>();
    ongoingEventTarget.addEventListener('event', event => buffer.push(event), { signal: buffer.signal });
    yield *await readHistoryEvents();
    yield *buffer;
}
```
