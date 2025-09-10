import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import store from '../store';

// Hoist mocks for react-dom/client
const { renderMock, createRootMock } = vi.hoisted(() => {
  const renderMock = vi.fn();
  const createRootMock = vi.fn(() => ({ render: renderMock }));
  return { renderMock, createRootMock };
});

vi.mock('react-dom/client', () => ({
  default: { createRoot: createRootMock },
  createRoot: createRootMock,
}));

// Test to ensure main entry renders root and configures providers

describe('main.jsx', () => {
  let rootEl;

  beforeEach(() => {
    renderMock.mockClear();
    createRootMock.mockClear();
    rootEl = {};
    global.document = {
      getElementById: vi.fn(() => rootEl),
    };
  });

  afterEach(() => {
    vi.resetModules();
    delete global.document;
  });

  it('renders root element with configured providers', async () => {
    await import('../main.jsx');

    expect(global.document.getElementById).toHaveBeenCalledWith('root');
    expect(createRootMock).toHaveBeenCalledWith(rootEl);
    expect(renderMock).toHaveBeenCalledTimes(1);

    const element = renderMock.mock.calls[0][0];
    expect(element.type).toBe(React.StrictMode);

    const providerEl = element.props.children;
    expect(providerEl.type).toBe(Provider);
    expect(providerEl.props.store).toBe(store);

    const routerEl = providerEl.props.children;
    expect(routerEl.type).toBe(BrowserRouter);

    const appEl = routerEl.props.children;
    expect(appEl.type).toBe(App);
  });
});
