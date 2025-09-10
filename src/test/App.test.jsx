import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App.jsx';

vi.mock('../routes/Routes.jsx', () => ({
  default: React.lazy(() => new Promise(() => {})),
}));

const renderWithStore = () => {
  const store = configureStore({
    reducer: { products: (s) => s || {}, user: (s) => s || {} },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

describe('App', () => {
  it('shows Loader while routes are loading', () => {
    renderWithStore();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
