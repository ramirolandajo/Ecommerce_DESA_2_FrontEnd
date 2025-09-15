import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Purchase from "../Purchase.jsx";

// Mock fetch global
const originalFetch = global.fetch;

describe("Purchase screen", () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("muestra mensaje cuando no hay state", () => {
    render(
      <MemoryRouter initialEntries={["/purchase"]}>
        <Routes>
          <Route path="/purchase" element={<Purchase />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Compra pendiente/i)).toBeInTheDocument();
    expect(screen.getByText(/No hay información de la compra/i)).toBeInTheDocument();
  });

  it("muestra detalle cuando hay state con id y fetch responde", async () => {
    const details = { id: 99, ok: true };
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(details) });

    render(
      <MemoryRouter initialEntries={[{ pathname: "/purchase", state: { id: 99, foo: "bar" } }] }>
        <Routes>
          <Route path="/purchase" element={<Purchase />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Compra #99 confirmada/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText((content) => content.includes("\"ok\": true"))).toBeInTheDocument();
    });
  });
});
