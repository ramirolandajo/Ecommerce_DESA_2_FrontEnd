import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const navigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => navigate,
}));
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../api/auth', () => ({
  logout: vi.fn(() => Promise.resolve({})),
}));
import { logout as apiLogout } from '../../api/auth';

// Mock headlessui to avoid ResizeObserver issues in tests
vi.mock('@headlessui/react', () => {
  const React = require('react');
  // helper that returns only children, ignores props to avoid invalid DOM attributes
  const passthrough = (tag) => (props) => React.createElement(React.Fragment, null, props.children);
  return {
    Disclosure: passthrough('nav'),
    DisclosureButton: passthrough('button'),
    DisclosurePanel: passthrough('div'),
    Menu: passthrough('div'),
    // Make MenuButton render an actual button so it is queryable by role
    MenuButton: (props) => React.createElement('button', { type: 'button' }, props.children),
    // MenuItem should expose the children directly so nested buttons work as expected
    MenuItem: (props) => props.children,
    MenuItems: passthrough('div'),
    // Dialog/Transition primitives used by CartDrawer
    Transition: passthrough('div'),
    TransitionChild: passthrough('div'),
    Dialog: passthrough('div'),
    DialogBackdrop: passthrough('div'),
    DialogPanel: passthrough('div'),
  };
});

// Ensure ResizeObserver is defined for headlessui usage in tests
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}

import Navbar from '../Navbar.jsx';
import userReducer from '../../store/user/userSlice.js';

describe('Navbar', () => {
  beforeEach(() => {
    navigate.mockReset();
  });

  it('does not open cart and redirects to login when logged out', async () => {
    const store = configureStore({
      reducer: {
        user: () => ({ isLoggedIn: false, userInfo: null }),
        cart: () => ({ items: [] }),
        products: () => ({ items: [], status: 'succeeded' }),
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('link', { name: /ingresa/i })).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Carrito'));
    expect(screen.queryByText('Your Cart')).toBeNull();
    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('logs out via menu when logged in', async () => {
    const store = configureStore({
      reducer: {
        user: userReducer,
        cart: () => ({ items: [] }),
        products: () => ({ items: [], status: 'succeeded' }),
      },
      preloadedState: {
        user: { userInfo: { id: 1 }, token: 'tok', isLoggedIn: true },
      },
    });

    global.localStorage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
    };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    // El botón del menú de usuario muestra inicialmente "U"
    await userEvent.click(screen.getByRole('button', { name: 'U' }));
    await userEvent.click(screen.getByRole('button', { name: /cerrar sesi/i }));
    await waitFor(() => expect(store.getState().user.isLoggedIn).toBe(false));
    expect(apiLogout).toHaveBeenCalled();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });
});
