import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterSidebar from '../FilterSidebar.jsx';

describe('FilterSidebar', () => {
  const categories = [{ name: 'Electronics', subs: ['Phones'] }];

  it('renders categories and resets filters', async () => {
    const onCategory = vi.fn();
    const onSubcategory = vi.fn();
    const onMin = vi.fn();
    const onMax = vi.fn();
    render(
      <FilterSidebar
        open={true}
        onClose={vi.fn()}
        categories={categories}
        category="Todas"
        subcategory=""
        min=""
        max=""
        onCategory={onCategory}
        onSubcategory={onSubcategory}
        onMin={onMin}
        onMax={onMax}
      />
    );
    expect(screen.getByLabelText('Categoría')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Limpiar filtros'));
    expect(onCategory).toHaveBeenCalledWith('Todas');
    expect(onSubcategory).toHaveBeenCalledWith('');
    expect(onMin).toHaveBeenCalledWith('');
    expect(onMax).toHaveBeenCalledWith('');
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();
    render(
      <FilterSidebar
        open={true}
        onClose={onClose}
        categories={categories}
        category="Todas"
        subcategory=""
        min=""
        max=""
        onCategory={() => {}}
        onSubcategory={() => {}}
        onMin={() => {}}
        onMax={() => {}}
      />
    );
    await userEvent.click(screen.getByLabelText('Cerrar filtros'));
    expect(onClose).toHaveBeenCalled();
  });
});
