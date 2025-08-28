import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

export function persistedWritable<T>(key: string, initial: T): Writable<T> {
  let start = initial;
  if (browser) {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) start = JSON.parse(raw) as T;
    } catch {
      // ignore parse errors and use initial
    }
  }

  const store = writable<T>(start);

  if (browser) {
    store.subscribe((value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // storage may be unavailable; ignore
      }
    });
  }

  return store;
}

