// test/setup.js
import "@testing-library/jest-dom";
import { afterEach, afterAll, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { mockAnimationsApi } from 'jsdom-testing-mocks';

// --- Opcional para debug de leaks (activar solo cuando querés investigar) ---
// import "why-is-node-running/register";

// Mock de ResizeObserver (MUI/Drawers suelen usarlo)
vi.stubGlobal("ResizeObserver", vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})));
// Also ensure global property exists on globalThis for libraries that read it directly
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = vi.fn(() => ({
    observe: () => {},
    unobserve: () => {},
    disconnect: () => {},
  }));
}
// also set on global and window if present
if (typeof global === 'object' && typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = globalThis.ResizeObserver;
}
if (typeof globalThis.window === 'object' && typeof globalThis.window.ResizeObserver === 'undefined') {
  globalThis.window.ResizeObserver = globalThis.ResizeObserver;
}

// matchMedia para media queries / prefers-reduced-motion
vi.stubGlobal("matchMedia", (query) => ({
  matches: /prefers-reduced-motion/.test(query),
  media: query,
  onchange: null,
  addListener() {}, // legacy
  removeListener() {}, // legacy
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() { return false; },
}));

// Evitar animaciones colgadas
vi.stubGlobal("requestAnimationFrame", (cb) => setTimeout(cb, 0));
vi.stubGlobal("cancelAnimationFrame", (id) => clearTimeout(id));

// Mock animations API for Headless UI
mockAnimationsApi();

// Si usás MSW, descomentá estos hooks y definí tu server en test/msw/server
// import { server } from "./msw/server";

beforeAll(() => {
  // server?.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  cleanup();
  try { vi.useRealTimers(); } catch {}
  vi.clearAllMocks();
  vi.resetModules();
  // server?.resetHandlers();
});

afterAll(() => {
  // server?.close();
});
