import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../../../api/address.js', () => ({
  getAddresses: vi.fn(async () => ([
    { id: 1, description: 'Main', tag: 'home' },
    { id: 2, description: ['Line 1', 'Line 2'], tag: 'office' },
  ])),
  addAddress: vi.fn(async ({ description }) => ({ id: 3, description, tag: 'new' })),
  updateAddress: vi.fn(async (id, { description }) => ({ id, description, tag: 'upd' })),
  deleteAddress: vi.fn(async (id) => ({})),
}));

import { getAddresses, addAddress, updateAddress, deleteAddress } from '../../../api/address.js';
import AddressStep from '../AddressStep.jsx';

function setup() {
  const setAddress = vi.fn();
  const utils = render(<AddressStep address={''} setAddress={setAddress} />);
  return { setAddress, container: utils.container };
}

describe('AddressStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and adapts addresses on mount', async () => {
    setup();
    expect(getAddresses).toHaveBeenCalled();
    await waitFor(() => expect(screen.getAllByRole('radio')).toHaveLength(2));
    // Titles present (tags rendered as small badge)
    expect(screen.getAllByText(/home|office/i).length).toBeGreaterThan(0);
  });

  it('creates a new address from form and calls setAddress', async () => {
    const { setAddress, container } = setup();

    // Open form
    await userEvent.click(screen.getByRole('button', { name: /agregar nueva dirección/i }));

    // Fill required fields via name selectors
    const provincia = container.querySelector('select[name="provincia"]');
    const ciudad = container.querySelector('input[name="ciudad"]');
    const cp = container.querySelector('input[name="cp"]');
    const calle = container.querySelector('input[name="calle"]');
    const numero = container.querySelector('input[name="numero"]');

    await userEvent.selectOptions(provincia, 'Buenos Aires');
    await userEvent.type(ciudad, 'La Plata');
    await userEvent.type(cp, '1900');
    await userEvent.type(calle, 'Calle 1');
    await userEvent.type(numero, '123');

    await userEvent.click(screen.getByRole('button', { name: /guardar dirección/i }));

    await waitFor(() => expect(addAddress).toHaveBeenCalled());
    expect(setAddress).toHaveBeenCalledWith(3);
  });

  it('edits an existing address and updates the list', async () => {
    const { container } = setup();

    await waitFor(() => expect(screen.getAllByRole('radio')).toHaveLength(2));

    // Click first edit (button title="Editar")
    const editButtons = screen.getAllByTitle(/editar/i);
    await userEvent.click(editButtons[0]);

    // Change city
    const city = container.querySelector('input[name="ciudad"]');
    await userEvent.clear(city);
    await userEvent.type(city, 'Nueva Ciudad');

    await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => expect(updateAddress).toHaveBeenCalled());
  });

  it('deletes an address and removes it from the list', async () => {
    setup();

    await waitFor(() => expect(screen.getAllByRole('radio')).toHaveLength(2));

    // Click first delete (button title="Eliminar")
    const delButtons = screen.getAllByTitle(/eliminar/i);
    await userEvent.click(delButtons[0]);

    await waitFor(() => expect(deleteAddress).toHaveBeenCalled());
  });
});
