import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../Footer.jsx';

describe('Footer', () => {
  it('renders current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText((text) => text.includes(year))).toBeInTheDocument();
  });
});
