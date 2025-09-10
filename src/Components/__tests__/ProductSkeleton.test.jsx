import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ProductSkeleton from '../ProductSkeleton.jsx';

describe('ProductSkeleton', () => {
  it('renders skeleton blocks', () => {
    const { container } = render(<ProductSkeleton />);
    expect(container.querySelectorAll('.bg-zinc-200').length).toBeGreaterThan(0);
  });
});
