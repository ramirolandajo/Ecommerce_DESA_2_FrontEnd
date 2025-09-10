import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import React from 'react';
import Shop from '../Shop.jsx';
import productsReducer from '../../store/products/productsSlice.js';

const renderWithStore = (store) => (
  <Provider store={store}>
    <MemoryRouter initialEntries={['/shop']}>
      <Routes>
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </MemoryRouter>
  </Provider>
);

describe('Shop screen', () => {
  it('renders error message when failed', () => {
    const store = configureStore({
      reducer: {
        products: productsReducer,
        cart: (s) => s || {},
        user: (s) => s || {},
        favourites: (s) => s || { items: [], status: 'succeeded', error: null },
      },
      preloadedState: { products: { items: [], status: 'failed', error: 'oops' } },
    });
    const html = renderToString(renderWithStore(store));
    expect(html).toContain('oops');
  });
});

