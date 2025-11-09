import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { act } from '@testing-library/react';
import VerifyEmail from '../VerifyEmail.jsx';

vi.mock('react-redux', () => {
  return {
    useDispatch: vi.fn(() => dispatchMock),
  };
});
vi.mock('react-router-dom', () => {
  return {
    useLocation: vi.fn(() => ({ state: null })),
    useNavigate: vi.fn(() => vi.fn()), // mock agregado
  };
});

const dispatchMock = vi.fn();

describe('VerifyEmail screen', () => {
  beforeEach(() => {
    dispatchMock.mockReset();
  });

  it('shows success message on fulfilled action', async () => {
    dispatchMock.mockResolvedValueOnce({ type: 'user/verifyEmail/fulfilled' });

    const container = document.createElement('div');
    document.body.appendChild(container);
    const { createRoot } = require('react-dom/client');

    await act(async () => {
      createRoot(container).render(<VerifyEmail />);
    });

    const form = container.querySelector('form');
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(dispatchMock).toHaveBeenCalled();
    expect(container.textContent).toContain('¡Verificación exitosa!');
  });

  it('shows error message on rejected action', async () => {
    dispatchMock.mockResolvedValueOnce({ type: 'user/verifyEmail/rejected' });

    const container = document.createElement('div');
    document.body.appendChild(container);
    const { createRoot } = require('react-dom/client');

    await act(async () => {
      createRoot(container).render(<VerifyEmail />);
    });

    const form = container.querySelector('form');
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(dispatchMock).toHaveBeenCalled();
    expect(container.textContent).toContain('La verificación falló.');
  });
});
