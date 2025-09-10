import React from 'react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import GlassProductCard from '../GlassProductCard.jsx';
import favouritesReducer from '../../store/favourites/favouritesSlice.js';

vi.mock('../../api/favourites.js', () => ({
  default: {
    getFavouriteProducts: vi.fn().mockResolvedValue([]),
    addFavouriteProduct: vi.fn().mockImplementation((id) => Promise.resolve({ id })),
    removeFavouriteProduct: vi.fn().mockResolvedValue(),
  },
}));

describe('GlassProductCard', () => {
  const baseItem = {
    id: 1,
    title: 'Test',
    price: 100,
    mediaSrc: [],
    stock: 0
  };

  const renderWithStore = (ui, { preloadedState } = {}) => {
    const store = configureStore({
      reducer: {
        favourites: favouritesReducer,
        user: () => ({ isLoggedIn: true }),
      },
      preloadedState,
    });
    return { ...render(<Provider store={store}>{ui}</Provider>), store };
  };

  it('prevents navigation when out of stock', () => {
    renderWithStore(
      <MemoryRouter>
        <GlassProductCard item={{...baseItem, stock: 0}} />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: 'Test' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabIndex', '-1');
  });

  it('allows navigation when in stock', () => {
    renderWithStore(
      <MemoryRouter>
        <GlassProductCard item={{...baseItem, stock: 5}} />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: 'Test' });
    expect(link).not.toHaveAttribute('aria-disabled');
    expect(link).not.toHaveAttribute('tabIndex');
  });

  it('dispatches addFavourite on heart click', async () => {
    const { store } = renderWithStore(
      <MemoryRouter>
        <GlassProductCard item={{...baseItem, stock: 5}} />
      </MemoryRouter>
    );
    const button = screen.getByLabelText('Agregar a favoritos');
    fireEvent.click(button);
    await waitFor(() => expect(store.getState().favourites.items).toHaveLength(1));
  });
});
