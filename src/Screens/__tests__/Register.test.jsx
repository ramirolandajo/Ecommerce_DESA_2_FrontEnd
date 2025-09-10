import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../Register.jsx';

const dispatch = vi.fn(() => ({ unwrap: () => Promise.resolve() }));
const navigate = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => dispatch,
}));
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
}));

describe('Register screen', () => {
  beforeEach(() => {
    dispatch.mockClear();
    navigate.mockClear();
  });

  it('renders link to login', () => {
    render(<Register />);
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('redirects to verify-email with email state on success', async () => {
    render(<Register />);
    await userEvent.type(screen.getByLabelText(/nombre/i), 'User');
    await userEvent.type(screen.getByLabelText(/correo/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'pass1234');
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'pass1234');
    await userEvent.click(screen.getByRole('button', { name: /registrarse/i }));
    expect(dispatch).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/verify-email', { state: { email: 'user@example.com' } });
  });
});
