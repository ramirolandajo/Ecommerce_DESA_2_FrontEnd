import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, { login, register, verifyEmail, logout } from '../user/userSlice.js';

describe('userSlice with store', () => {
  const createStore = () => configureStore({ reducer: { user: userReducer } });

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
  });

  it.each([
    ['login', login.fulfilled],
    ['verifyEmail', verifyEmail.fulfilled],
  ])('handles %s.fulfilled', (_, action) => {
    const store = createStore();
    const payload = { user: { id: 1, name: 'Alice' }, token: 'abc' };
    store.dispatch(action(payload));
    const state = store.getState().user;
    expect(state).toEqual({
      userInfo: payload.user,
      token: payload.token,
      isLoggedIn: true,
    });
    expect(localStorage.getItem('token')).toBe(payload.token);
  });

  it('keeps user logged out after register.fulfilled', () => {
    const store = createStore();
    store.dispatch(register.fulfilled({ message: 'ok' }));
    const state = store.getState().user;
    expect(state).toEqual({ userInfo: null, token: null, isLoggedIn: false });
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('handles logout.fulfilled', () => {
    const store = createStore();
    const payload = { user: { id: 1 }, token: 'abc' };
    store.dispatch(login.fulfilled(payload));
    store.dispatch(logout.fulfilled());
    const state = store.getState().user;
    expect(state).toEqual({
      userInfo: null,
      token: null,
      isLoggedIn: false,
    });
    expect(localStorage.getItem('token')).toBeNull();
  });
});
