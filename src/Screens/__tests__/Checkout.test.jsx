import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { renderToString } from 'react-dom/server';

import Checkout from '../Checkout.jsx';
import cartReducer from '../../store/cart/cartSlice.js';
import purchaseReducer from '../../store/purchase/purchaseSlice.js';

vi.mock('../../api/purchase.js', () => ({
  default: {
    createCart: vi.fn().mockResolvedValue({ id: 1 }),
    confirmPurchase: vi.fn().mockResolvedValue({}),
    clearCart: vi.fn().mockResolvedValue({}),
    fetchCart: vi.fn(),
    createPurchase: vi.fn(),
  },
}));

vi.mock('../../Components/Checkout/Stepper.jsx', () => ({
  default: ({ handleConfirm }) => <button onClick={handleConfirm}>Pagar</button>,
}));

const renderWithStore = (preloadedState, initialEntries = ['/checkout']) => {
  const store = configureStore({
    reducer: { cart: cartReducer, purchase: purchaseReducer, products: (s) => s || {}, user: (s) => s || {} },
    preloadedState,
  });
  return {
    html: renderToString(
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/purchase/:id" element={<div>Purchase Detail</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    ),
    store,
  };
};

describe('Checkout screen', () => {
  it('renders empty cart message', () => {
    const { html } = renderWithStore({ cart: { items: [] } });
    expect(html).toContain('No hay productos en el carrito');
  });

  it('confirms purchase on pay', async () => {
    const items = [{ id: 1, title: 'A', price: 10, quantity: 1 }];
    const store = configureStore({
      reducer: { cart: cartReducer, purchase: purchaseReducer, products: (s) => s || {}, user: (s) => s || {} },
      preloadedState: {
        cart: { items, totalQuantity: 1, totalAmount: 10 },
        purchase: { id: 1, reservationTimestamp: null, status: 'idle', timeLeft: 0 },
      },
    });

    const container = document.createElement('div');
    document.body.appendChild(container);
    const { createRoot } = require('react-dom/client');

    const purchaseService = (await import('../../api/purchase.js')).default;

    await act(async () => {
      createRoot(container).render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/checkout']}>
            <Routes>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/purchase/:id" element={<div>Purchase Detail</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    });

    const button = container.querySelector('button');
    await act(async () => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(purchaseService.confirmPurchase).toHaveBeenCalled();
  });
});
