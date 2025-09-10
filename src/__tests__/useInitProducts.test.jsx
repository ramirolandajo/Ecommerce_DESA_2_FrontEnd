import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, waitFor } from '@testing-library/react';
import productsReducer, { fetchProducts } from '../store/products/productsSlice.js';
import useInitProducts from '../hooks/useInitProducts.js';

function TestComponent() {
  useInitProducts();
  return null;
}

describe('useInitProducts', () => {
  it('dispatches fetchProducts on idle status', async () => {
    const dispatchedActions = [];
    const actionLogger = () => next => action => {
      dispatchedActions.push(action);
      return next(action);
    };
    const store = configureStore({
      reducer: { products: productsReducer },
      preloadedState: { products: { items: [], status: 'idle', error: null } },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(actionLogger),
    });

    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );

    await waitFor(() => {
      const pendingCalled = dispatchedActions.some(action => action.type === fetchProducts.pending.type);
      expect(pendingCalled).toBe(true);
    });
  });
});
