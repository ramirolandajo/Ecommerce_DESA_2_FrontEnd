import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Home from '../Home.jsx';

const renderWithStore = (preloadedState) => {
  const store = configureStore({
    reducer: {
      products: (s) => s || {},
      user: (s) => s || {},
      favourites: (s) => s || { items: [], status: 'succeeded', error: null },
    },
    preloadedState,
  });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/']}>
        <Home />
      </MemoryRouter>
    </Provider>
  );
};

describe('Home screen', () => {
  it('renders hero and product tiles section', () => {
    renderWithStore({ products: { items: [] } });
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('product-tiles-section')).toBeInTheDocument();
  });
});
