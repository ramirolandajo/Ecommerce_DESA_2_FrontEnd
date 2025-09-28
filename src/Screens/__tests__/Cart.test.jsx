import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

vi.mock('../../api/purchase.js', () => ({
  default: {
    createCart: vi.fn().mockResolvedValue({
      id: 1,
      date: '',
      reservationTime: new Date(Date.now() + 10000).toISOString(),
      status: '',
    }),
    fetchCart: vi.fn(),
    clearCart: vi.fn(),
    createPurchase: vi.fn(),
  },
}));

import Cart from '../Cart.jsx';
import cartReducer, { updateQuantity } from '../../store/cart/cartSlice.js';

const renderWithStore = (preloadedState) => {
  const store = configureStore({
    reducer: { cart: cartReducer, products: (s) => s || {}, user: (s) => s || {} },
    preloadedState,
  });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/cart']}>
        <Cart />
      </MemoryRouter>
    </Provider>
  );
};

beforeEach(() => {
  localStorage.clear();
});

describe('Cart screen', () => {
  it('renders empty cart message with link to shop', () => {
    renderWithStore({ cart: { items: [] } });
    expect(screen.getByText(/carrito está vacío/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /seguir comprando/i })
    ).toBeInTheDocument();
  });

  it('renders checkout link when items exist', () => {
    const { container } = renderWithStore({
      cart: { items: [{ id: 1, title: 'A', price: 10, quantity: 1 }] },
    });
    const html = container.innerHTML;
    expect(html).toContain('Finalizar compra');
    expect(html).toContain('data-testid="checkout-button"');
    expect(html).not.toContain('href="/checkout"');
  });

  it('does not dispatch updateQuantity for invalid input', () => {
    const preloadedState = { cart: { items: [{ id: 1, title: 'A', price: 10, quantity: 1 }] } };
    const store = configureStore({
      reducer: { cart: cartReducer, products: (s) => s || {}, user: (s) => s || {} },
      preloadedState,
    });
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const container = document.createElement('div');
    document.body.appendChild(container);

    const { createRoot } = require('react-dom/client');
    const { act } = require('react-dom/test-utils');

    act(() => {
      createRoot(container).render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/cart']}>
            <Routes>
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    });

    const input = container.querySelector('input[type="number"]');
    act(() => {
      input.value = '0';
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: updateQuantity.type })
    );
  });

  it('creates cart and navigates on checkout click', async () => {
    const items = [{ id: 1, title: 'A', price: 10, quantity: 1 }];
    const store = configureStore({
      reducer: { cart: cartReducer, products: (s) => s || {}, user: (s) => s || {} },
      preloadedState: { cart: { items, totalQuantity: 1, totalAmount: 10 } },
    });
    const container = document.createElement('div');
    document.body.appendChild(container);

    const { createRoot } = require('react-dom/client');
    const { act } = require('react-dom/test-utils');

    act(() => {
      createRoot(container).render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/cart']}>
            <Routes>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<div>En checkout</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>,
      );
    });

    const button = container.querySelector('[data-testid="checkout-button"]');

    await act(async () => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(localStorage.getItem('checkout')).toBeNull();
    expect(container.innerHTML).toContain('En checkout');
  });
});
