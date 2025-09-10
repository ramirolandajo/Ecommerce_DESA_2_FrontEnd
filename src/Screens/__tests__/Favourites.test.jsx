import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
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
