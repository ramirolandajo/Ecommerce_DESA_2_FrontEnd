import React from 'react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import RelatedProductsSection from '../RelatedProductsSection.jsx';

describe('RelatedProductsSection', () => {
  it('returns null when no products provided', () => {
    const html = renderToString(
      <MemoryRouter>
        <RelatedProductsSection products={[]} />
      </MemoryRouter>
    );
    expect(html).toBe('');
  });

  it('renders product cards when products are provided', () => {
    const products = [
      { id: 1, title: 'Prod 1', stock: 1 },
      { id: 2, title: 'Prod 2', stock: 1 },
    ];

    const html = renderToString(
      <MemoryRouter>
        <RelatedProductsSection products={products} />
      </MemoryRouter>
    );

    expect(html).toContain('Prod 1');
    expect(html).toContain('Prod 2');
  });
});
