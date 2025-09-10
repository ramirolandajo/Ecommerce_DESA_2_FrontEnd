import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CategoryButton from '../CategoryButton.jsx';

describe('CategoryButton', () => {
  it('renders label and handles click', async () => {
    const onClick = vi.fn();
    render(<CategoryButton name="Tech" onClick={onClick} />);
    expect(screen.getByRole('button', { name: 'Tech' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Tech' }));
    expect(onClick).toHaveBeenCalled();
  });

  it('indicates selected state', () => {
    const { getByRole } = render(
      <CategoryButton name="Tech" selected={true} onClick={() => {}} />
    );
    expect(getByRole('button').getAttribute('aria-pressed')).toBe('true');
  });
});
