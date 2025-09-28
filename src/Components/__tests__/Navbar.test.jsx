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

import Navbar from '../Navbar.jsx';
import userReducer from '../../store/user/userSlice.js';

describe('Navbar', () => {
  beforeEach(() => {
    navigate.mockReset();
  });

  it('does not open cart and redirects to login when logged out', async () => {
    window.alert = vi.fn();
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
    expect(window.alert).toHaveBeenCalled();
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
    await userEvent.click(screen.getByRole('menuitem', { name: /cerrar sesi/i }));
    await waitFor(() => expect(store.getState().user.isLoggedIn).toBe(false));
    expect(apiLogout).toHaveBeenCalled();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });
});
