import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import CartDrawer from '../CartDrawer.jsx';

const renderWithStore = (ui, {state}={}) => {
  const store = configureStore({
    reducer: { cart: () => state?.cart || {items: []} }
  });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </Provider>
  );
};

describe('CartDrawer', () => {
  it('shows empty state and triggers onClose', async () => {
    const onClose = vi.fn();
    renderWithStore(<CartDrawer open={true} onClose={onClose} />);
    expect(await screen.findByText('Tu carrito está vacío')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Cerrar carrito'));
    expect(onClose).toHaveBeenCalled();
  });
});
