import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import Login from '../Login.jsx';

const dispatch = vi.fn(() => ({ unwrap: () => Promise.resolve() }));
const navigate = vi.fn();
const mockLocation = { state: {} };

vi.mock('react-redux', () => ({
  useDispatch: () => dispatch,
  useSelector: () => ({})
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
  useLocation: () => mockLocation
}));

vi.mock('../store/user/userSlice.js', () => ({
  login: (user) => ({ type: 'user/login', payload: user })
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockLocation.state = {};
  localStorage.clear();
});

describe('Login screen', () => {
  it('redirects to protected route after login', async () => {
    mockLocation.state.from = '/protected';
    const container = document.createElement('div');
    document.body.appendChild(container);
    const { createRoot } = require('react-dom/client');
    const { act } = require('react-dom/test-utils');

    act(() => {
      createRoot(container).render(<Login />);
    });

    const form = container.querySelector('form');
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(dispatch).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/protected');
  });

  it('redirects to postLoginRedirect and removes it', async () => {
    localStorage.setItem('postLoginRedirect', '/special');
    mockLocation.state.from = '/protected';
    const container = document.createElement('div');
    document.body.appendChild(container);
    const { createRoot } = require('react-dom/client');
    const { act } = require('react-dom/test-utils');

    act(() => {
      createRoot(container).render(<Login />);
    });

    const form = container.querySelector('form');
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(navigate).toHaveBeenCalledWith('/special');
    expect(localStorage.getItem('postLoginRedirect')).toBeNull();
  });
});
