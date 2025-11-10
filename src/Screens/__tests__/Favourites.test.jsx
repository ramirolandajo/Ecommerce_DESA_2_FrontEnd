import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

// Mockear solo fetchFavourites, conservando el resto del módulo (incluido el reducer)
vi.mock('../../store/favourites/favouritesSlice.js', async () => {
  const actual = await vi.importActual('../../store/favourites/favouritesSlice.js');
  return {
    __esModule: true,
    ...actual,
    // reemplazamos fetchFavourites por un thunk que no realiza llamadas ni dispatch adicionales
    fetchFavourites: () => () => Promise.resolve(),
  };
});

import Favourites from '../Favourites.jsx';
import favouritesReducer from '../../store/favourites/favouritesSlice.js';

describe('Favourites screen', () => {
  it('renders favourite items', () => {
    const store = configureStore({
      reducer: {
        favourites: favouritesReducer,
        user: () => ({ isLoggedIn: true }),
      },
      preloadedState: {
        favourites: {
          items: [{ id: 1, title: 'Fav 1', price: 10, mediaSrc: [], stock: 1 }],
          status: 'succeeded',
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Favourites />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Fav 1')).toBeInTheDocument();
  });
});
