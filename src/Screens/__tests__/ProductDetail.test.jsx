import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductDetail from '../ProductDetail.jsx';
import productsReducer, { fetchProduct } from '../../store/products/productsSlice.js';
import favouritesReducer from '../../store/favourites/favouritesSlice.js';

vi.mock('../../api/favourites.js', () => ({
  default: {
    getFavouriteProducts: vi.fn().mockResolvedValue([]),
    addFavouriteProduct: vi.fn().mockImplementation((id) => Promise.resolve({ id })),
    removeFavouriteProduct: vi.fn().mockResolvedValue(),
  },
}));
import React from "react";

describe('ProductDetail', () => {
  it('shows Loader when status is loading', () => {
    const store = configureStore({
      reducer: {
        products: productsReducer,
        cart: (state = {}) => state,
        user: (state = {}) => state,
        favourites: (s) => s || { items: [], status: 'succeeded', error: null },
      },
      preloadedState: {
        products: { items: [], current: null, related: [], status: 'loading', error: null },
      },
    });

    const html = renderToString(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/product/1']}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(html).toContain('border-t-transparent');
  });

  it('renders subcategory breadcrumb', () => {
    const product = {
      id: 1,
      title: 'Test Product',
      subcategory: { id: 1, name: 'Phones', active: true },
      categories: [{ id: 2, name: 'Tech', active: true }],
      mediaSrc: [{ src: 'img.jpg' }],
      brand: { id: 10, name: 'BrandX' },
      priceUnit: 100,
      discount: 10,
    };
    const store = configureStore({
      reducer: {
        products: productsReducer,
        cart: (state = {}) => state,
        user: (state = {}) => state,
        favourites: (s) => s || { items: [], status: 'succeeded', error: null },
      },
      preloadedState: {
        products: { items: [], current: product, related: [], status: 'succeeded', error: null },
      },
    });
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const html = renderToString(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/product/1']}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(html).toContain('Phones');
    expect(html).toContain('BrandX');
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: fetchProduct.pending.type })
    );
  });

  it('renders related products section', () => {
    const product = {
      id: 1,
      title: 'Main Product',
      subcategory: { id: 1, name: 'Phones', active: true },
      categories: [{ id: 2, name: 'Tech', active: true }],
      mediaSrc: [{ src: 'img.jpg' }],
      brand: { id: 10, name: 'BrandX' },
      priceUnit: 100,
      discount: 10,
    };
    const related = [
      { id: 2, title: 'Rel 1', stock: 1 },
      { id: 3, title: 'Rel 2', stock: 1 },
    ];
    const store = configureStore({
      reducer: {
        products: productsReducer,
        cart: (state = {}) => state,
        user: (state = {}) => state,
        favourites: (s) => s || { items: [], status: 'succeeded', error: null },
      },
      preloadedState: {
        products: {
          items: [],
          current: product,
          related,
          status: 'succeeded',
          error: null,
        },
      },
    });

    const html = renderToString(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/product/1']}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(html).toContain('Rel 1');
    expect(html).toContain('Rel 2');
  });

  it('allows toggling favourites', async () => {
    const product = {
      id: 1,
      title: 'Main Product',
      subcategory: { id: 1, name: 'Phones', active: true },
      categories: [{ id: 2, name: 'Tech', active: true }],
      mediaSrc: [{ src: 'img.jpg' }],
      brand: { id: 10, name: 'BrandX' },
      priceUnit: 100,
      discount: 10,
    };
    const store = configureStore({
      reducer: {
        products: productsReducer,
        favourites: favouritesReducer,
        cart: (state = {}) => state,
        user: () => ({ isLoggedIn: true }),
      },
      preloadedState: {
        products: { items: [], current: product, related: [], status: 'succeeded', error: null },
        favourites: { items: [], status: 'succeeded', error: null },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/product/1']}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const btn = screen.getByLabelText('Agregar a favoritos');
    fireEvent.click(btn);
    await waitFor(() => expect(store.getState().favourites.items).toHaveLength(1));
  });
});
