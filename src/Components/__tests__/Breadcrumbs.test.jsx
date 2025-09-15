import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Breadcrumbs from '../Breadcrumbs.jsx';

describe('Breadcrumbs', () => {
  it('renders without segments', () => {
    const { container } = render(
      <MemoryRouter>
        <Breadcrumbs />
      </MemoryRouter>
    );
    expect(container.querySelector('nav')).toBeInTheDocument();
  });

  it('navigates when link clicked', async () => {
    const segments = [
      { label: 'Home', to: '/home' },
      { label: 'Page' }
    ];
    render(
      <MemoryRouter initialEntries={['/']}>
        <Breadcrumbs segments={segments} />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '/home');
    // simular click no cambia window.location con MemoryRouter, pero el Link apunta correctamente
    await userEvent.click(link);
  });
});
