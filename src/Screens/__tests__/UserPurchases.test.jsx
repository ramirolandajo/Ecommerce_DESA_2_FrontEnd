import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import React from "react";

vi.mock("../../api/purchase", () => ({
  __esModule: true,
  default: {
    fetchUserPurchases: vi.fn(),
  },
}));

import purchaseService from "../../api/purchase";
import UserPurchases from "../UserPurchases.jsx";

function renderWithRoute() {
  return render(
    <MemoryRouter initialEntries={["/user-purchases"]}>
      <Routes>
        <Route path="/user-purchases" element={<UserPurchases />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("UserPurchases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra skeleton de carga y luego vacío", async () => {
    purchaseService.fetchUserPurchases.mockResolvedValueOnce([]);

    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByText(/No tienes compras realizadas/i)).toBeInTheDocument();
    });
  });

  it("muestra error cuando falla", async () => {
    purchaseService.fetchUserPurchases.mockRejectedValueOnce(new Error("boom"));

    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByText(/No se pudo cargar el historial de compras/i)).toBeInTheDocument();
    });
  });

  it("renderiza tarjetas y permite clickear", async () => {
    const data = [
      {
        id: 2,
        status: "CONFIRMED",
        date: new Date(2025, 0, 1).toISOString(),
        reservationTime: new Date(2025, 0, 2).toISOString(),
        direction: "Calle 1",
        cart: { finalPrice: 200, items: [] },
      },
      {
        id: 1,
        status: "PENDING",
        date: new Date(2025, 0, 1).toISOString(),
        reservationTime: new Date(2025, 0, 2).toISOString(),
        direction: "Calle 2",
        cart: { finalPrice: 100, items: [] },
      },
    ];
    purchaseService.fetchUserPurchases.mockResolvedValueOnce(data);

    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByText(/Mis compras/i)).toBeInTheDocument();
      expect(screen.getByText("#2")).toBeInTheDocument();
      expect(screen.getByText("#1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("#2"));
  });
});
