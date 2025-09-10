import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Outlet } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import AppRoutes from '../Routes.jsx';

vi.mock('../Layout.jsx', () => ({
  default: () => (
    <div data-testid="layout">
      <Outlet />
    </div>
  ),
}));

vi.mock('../../Screens/Home.jsx', () => ({
  default: () => <div>Home Page</div>,
}));

vi.mock('../../Screens/Login.jsx', () => ({
  default: () => <div>Login Page</div>,
}));

describe('AppRoutes', () => {
  it('renders auth routes outside layout', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <React.Suspense fallback={<div>Loading</div>}>
          <AppRoutes />
        </React.Suspense>
      </MemoryRouter>
    );

    expect(await screen.findByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByTestId('layout')).toBeNull();
  });

  it('wraps protected routes with layout', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <React.Suspense fallback={<div>Loading</div>}>
          <AppRoutes />
        </React.Suspense>
      </MemoryRouter>
    );

    expect(await screen.findByText('Home Page')).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });
});
