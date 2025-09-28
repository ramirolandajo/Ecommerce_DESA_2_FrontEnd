import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import React from "react";

import purchaseService from "../../api/purchase";
import PurchaseDetail from "../PurchaseDetail.jsx";

function renderWithRoute(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/purchase/:id" element={<PurchaseDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("PurchaseDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra skeleton de carga y luego éxito", async () => {
    vi.spyOn(purchaseService, "fetchPurchase").mockResolvedValueOnce({
      id: 5,
      status: "CONFIRMED",
      date: new Date(2025, 0, 1).toISOString(),
      reservationTime: new Date(2025, 0, 2).toISOString(),
      direction: "Calle Falsa 123, Piso 1",
      cart: {
        finalPrice: 123,
        items: [
          { id: 1, quantity: 2, product: { title: "A", price: 10, description: "d", mediaSrc: [] } },
        ],
      },
    });

    renderWithRoute("/purchase/5");

    expect(screen.queryByRole("heading", { name: /Compra #5/i })).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Compra #5/i)).toBeInTheDocument();
      expect(screen.getByText(/Total: \$123/i)).toBeInTheDocument();
    });
  });

  it("muestra error cuando fetch falla", async () => {
    vi.spyOn(purchaseService, "fetchPurchase").mockRejectedValueOnce(new Error("boom"));

    renderWithRoute("/purchase/10");

    await waitFor(() => {
      expect(screen.getByText(/No se pudo cargar la compra/i)).toBeInTheDocument();
    });
  });

  it("muestra 'Compra no encontrada' cuando no hay datos", async () => {
    vi.spyOn(purchaseService, "fetchPurchase").mockResolvedValueOnce(null);

    renderWithRoute("/purchase/11");

    await waitFor(() => {
      expect(screen.getByText(/Compra no encontrada/i)).toBeInTheDocument();
    });
  });
});
