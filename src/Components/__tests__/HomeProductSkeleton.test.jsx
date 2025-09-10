import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeProductSkeleton from '../HomeProductSkeleton.jsx';

describe('HomeProductSkeleton', () => {
  it('renders product skeleton', () => {
    const { container } = render(<HomeProductSkeleton />);
    expect(container.querySelector('.h-40')).toBeInTheDocument();
  });
});
