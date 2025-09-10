import { describe, it, expect, beforeEach } from 'vitest';
import store from '../index.js';
import { login, logout } from '../user/userSlice.js';
import {
  fetchFavourites,
  addFavourite,
  removeFavourite,
} from '../favourites/favouritesSlice.js';

describe('store index', () => {
  beforeEach(() => {
    let storage = {};
    global.localStorage = {
      getItem: (key) => storage[key] ?? null,
      setItem: (key, value) => {
        storage[key] = String(value);
      },
      removeItem: (key) => {
        delete storage[key];
      },
      clear: () => {
        storage = {};
      },
    };
    localStorage.clear();
    store.dispatch(logout.fulfilled());
    store.dispatch(fetchFavourites.fulfilled([]));
  });

  it('updates user state on login', () => {
    const payload = { user: { id: 1, name: 'Alice' }, token: 'abc' };
    store.dispatch(login.fulfilled(payload));
    expect(store.getState().user).toEqual({
      userInfo: payload.user,
      token: payload.token,
      isLoggedIn: true,
    });
  });

  it('resets user state on logout', () => {
    const payload = { user: { id: 1, name: 'Alice' }, token: 'abc' };
    store.dispatch(login.fulfilled(payload));
    store.dispatch(logout.fulfilled());
    expect(store.getState().user).toEqual({
      userInfo: null,
      token: null,
      isLoggedIn: false,
    });
  });

  it('handles favourites actions', () => {
    const initial = [{ id: 1 }, { id: 2 }];
    store.dispatch(fetchFavourites.fulfilled(initial));
    expect(store.getState().favourites.items).toEqual(initial);
    store.dispatch(addFavourite.fulfilled({ id: 3 }));
    expect(store.getState().favourites.items).toEqual([...initial, { id: 3 }]);
    store.dispatch(removeFavourite.fulfilled(1));
    expect(store.getState().favourites.items).toEqual([{ id: 2 }, { id: 3 }]);
  });
});
