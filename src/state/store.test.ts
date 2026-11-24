import { describe, expect, it, vi } from 'vitest';
import { createStore } from './store';

describe('createStore', () => {
  it('отдаёт начальное состояние', () => {
    expect(createStore({ count: 0 }).getState()).toEqual({ count: 0 });
  });

  it('обновляет состояние через функцию', () => {
    const store = createStore({ count: 1 });

    store.setState((previous) => ({ count: previous.count + 1 }));

    expect(store.getState()).toEqual({ count: 2 });
  });

  it('сообщает подписчику новое состояние', () => {
    const store = createStore({ count: 0 });
    const listener = vi.fn();
    store.subscribe(listener);

    store.setState(() => ({ count: 5 }));

    expect(listener).toHaveBeenCalledExactlyOnceWith({ count: 5 });
  });

  it('не вызывает подписчика, если состояние не изменилось', () => {
    const store = createStore({ count: 0 });
    const listener = vi.fn();
    store.subscribe(listener);

    store.setState((previous) => previous);

    expect(listener).not.toHaveBeenCalled();
  });

  it('перестаёт вызывать подписчика после отписки', () => {
    const store = createStore({ count: 0 });
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    unsubscribe();
    store.setState(() => ({ count: 1 }));

    expect(listener).not.toHaveBeenCalled();
  });
});
