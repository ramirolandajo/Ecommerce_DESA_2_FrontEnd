import React from "react";
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import Loader from '../Loader.jsx';

describe('Loader', () => {
  it('renders animated spinner', () => {
    const html = renderToString(<Loader />);
    expect(html).toContain('border-t-transparent');
  });
});
