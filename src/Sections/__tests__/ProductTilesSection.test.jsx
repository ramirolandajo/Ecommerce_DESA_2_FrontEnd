import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import ProductTilesSection from '../ProductTilesSection.jsx';
import productsReducer from '../../store/products/productsSlice.js';
import React from 'react';

describe('ProductTilesSection', () => {
  it('renders skeletons when loading', () => {
    const store = configureStore({
      reducer: {
        products: productsReducer,
        cart: (state = {}) => state,
        user: (state = {}) => state,
      },
      preloadedState: {
        products: { items: [], current: null, status: 'loading', error: null },
      },
    });

    const html = renderToString(
      <Provider store={store}>
        <MemoryRouter>
          <ProductTilesSection />
        </MemoryRouter>
      </Provider>
    );

    expect(html).toContain('h-40 w-full rounded-xl bg-zinc-200');
  });
});

