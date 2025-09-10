import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import Shop from '../Shop.jsx';
import productsReducer from '../../store/products/productsSlice.js';
import React from "react";

describe('Shop', () => {
  it('renders ProductSkeleton when showLoading is true', () => {
    const store = configureStore({
      reducer: {
        products: productsReducer,
        cart: (state = {}) => state,
        user: (state = {}) => state,
        favourites: (s) => s || { items: [], status: 'succeeded', error: null },
      },
      preloadedState: {
        products: { items: [], current: null, status: 'loading', error: null },
      },
    });

    const html = renderToString(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/shop']}>
          <Routes>
            <Route path="/shop" element={<Shop />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(html).toContain('h-40 w-full rounded-xl bg-zinc-200');
  });
});
