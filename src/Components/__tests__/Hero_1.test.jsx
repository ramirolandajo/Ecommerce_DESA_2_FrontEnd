import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import HeroShowcase from '../Hero_1.jsx';

describe('HeroShowcase', () => {
  const slides = [
    { id: '1', hero: true, title: 'Slide 1', description: 'Desc', mediaSrc: ['a'] },
    { id: '2', hero: true, title: 'Slide 2', description: 'Desc', mediaSrc: ['a'] },
    { id: '3', hero: true, title: 'Slide 3', description: 'Desc', mediaSrc: ['a'] },
    { id: '4', hero: true, title: 'Slide 4', description: 'Desc', mediaSrc: ['a'] }
  ];

  const store = configureStore({
    reducer: {
      products: () => ({ items: slides, status: 'succeeded' }),
      cart: () => ({ items: [] }),
      user: () => ({}),
      homeScreen: () => ({ hero: slides, status: 'succeeded' })
    }
  });

  it('changes slide on next click', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HeroShowcase />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
  });
});
