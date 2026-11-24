export type Listener<T> = (state: T) => void;

export interface Store<T> {
  getState(): T;
  setState(updater: (previous: T) => T): void;
  subscribe(listener: Listener<T>): () => void;
}

export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<Listener<T>>();

  return {
    getState: () => state,

    setState(updater) {
      const next = updater(state);
      if (Object.is(next, state)) {
        return;
      }
      state = next;
      for (const listener of [...listeners]) {
        listener(state);
      }
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
