import React from "react";
import { describe, it, expect, vi } from "vitest";
import { act, waitFor } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Stepper from "../Stepper.jsx";
import purchaseReducer, { tick } from "../../../store/purchase/purchaseSlice.js";

vi.mock("../../../api/address.js", () => ({
  getAddresses: vi.fn().mockImplementation(async () => {
    // debug log to verify mock is used during tests
    // eslint-disable-next-line no-console
    console.log('[mock getAddresses] called');
    return [
      {
        id: "home",
        // API-like shape: description as array
        description: ["123 Main St", "(000) 000-0000"],
        tag: "HOME",
      },
    ];
  }),
  addAddress: vi.fn(),
  updateAddress: vi.fn(),
  deleteAddress: vi.fn(),
}));

vi.mock("../../../api/purchase.js", () => ({
  default: {
    cancelPurchase: vi.fn().mockResolvedValue({}),
    createCart: vi.fn(),
    confirmPurchase: vi.fn(),
    fetchCart: vi.fn(),
    clearCart: vi.fn(),
    createPurchase: vi.fn(),
  },
}));

function setup(handleConfirm = vi.fn(), purchaseState) {
  const state =
    purchaseState ?? {
      id: 1,
      reservationTimestamp: new Date(Date.now() + 120000).toISOString(),
      status: "PENDING",
      timeLeft: 120,
    };
  const store = configureStore({
    reducer: {
      products: () => ({ items: [], status: "succeeded" }),
      purchase: purchaseReducer,
    },
    preloadedState: { purchase: state },
  });

  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <Provider store={store}>
        <Stepper items={[]} money={(n) => `$${n}`} handleConfirm={handleConfirm} />
      </Provider>
    );
  });
  return { container, root, handleConfirm, store };
}

describe("Stepper", () => {
  it("navigates through steps and calls confirm", async () => {
    const { container, handleConfirm } = setup();
    await act(async () => {});

    await waitFor(() => {
      const radio = container.querySelector('input[name="address"]');
      expect(radio).toBeInTheDocument();
    });

    const getButton = (text) =>
      Array.from(container.querySelectorAll("button")).find(
        (b) => b.textContent === text
      );

    const next = getButton("Siguiente");
    expect(next.disabled).toBe(true);

    const addressRadio = container.querySelector('input[name="address"]');
    act(() => {
      addressRadio.click();
    });
    expect(next.disabled).toBe(false);

    act(() => {
      next.click();
    });

    const shippingRadios = container.querySelectorAll('input[name="shipping"]');
    act(() => {
      shippingRadios[1].click(); // express
    });
    expect(getButton("Siguiente").disabled).toBe(false);

    act(() => {
      getButton("Siguiente").click();
    });

    const autofill = Array.from(container.querySelectorAll("button")).find((b) =>
      b.textContent.includes("Autocompletar VISA")
    );
    act(() => {
      autofill.click();
    });

    const pay = getButton("Pagar");
    expect(pay.disabled).toBe(false);
    act(() => {
      pay.click();
    });
    expect(handleConfirm).toHaveBeenCalled();
  });

  it("shows countdown and cancels purchase when timer expires", async () => {
    const { container, store } = setup(vi.fn(), {
      id: 1,
      reservationTimestamp: new Date(Date.now() + 2000).toISOString(),
      status: "PENDING",
      timeLeft: 2,
    });
    await act(async () => {});

    await waitFor(() => {
      const radio = container.querySelector('input[name="address"]');
      expect(radio).toBeInTheDocument();
    });

    const getButton = (text) =>
      Array.from(container.querySelectorAll("button")).find(
        (b) => b.textContent === text
      );

    // avanzar a paso 3
    const addressRadio = container.querySelector('input[name="address"]');
    act(() => {
      addressRadio.click();
    });
    act(() => {
      getButton("Siguiente").click();
    });
    const shippingRadios = container.querySelectorAll('input[name="shipping"]');
    act(() => {
      shippingRadios[0].click();
    });
    act(() => {
      getButton("Siguiente").click();
    });
    const autofill = Array.from(container.querySelectorAll("button")).find((b) =>
      b.textContent.includes("Autocompletar VISA")
    );
    act(() => {
      autofill.click();
    });
    const pay = getButton("Pagar");
    expect(pay.disabled).toBe(false);

    const countdown = container.querySelector('[data-testid="countdown"]');
    expect(countdown.textContent).toBe('00:02');

    act(() => {
      store.dispatch(tick());
    });
    await act(async () => {});
    expect(countdown.textContent).toBe('00:01');

    await act(async () => {
      store.dispatch(tick());
    });
    await act(async () => {});
    expect(countdown.textContent).toBe('00:00');

    const purchaseService = (await import("../../../api/purchase.js")).default;
    expect(purchaseService.cancelPurchase).toHaveBeenCalledWith(1);
    expect(pay.disabled).toBe(true);
  });

  it("renders progress bar proportional to time left", async () => {
    const { container, store } = setup(vi.fn(), {
      id: 1,
      reservationTimestamp: new Date(Date.now() + 4000).toISOString(),
      status: "PENDING",
      timeLeft: 4,
    });
    await act(async () => {});

    const progress = container.querySelector('[data-testid="time-progress"]');
    expect(progress.style.width).toBe("100%");

    act(() => {
      store.dispatch(tick());
    });
    await act(async () => {});

    expect(progress.style.width).toBe("75%");
  });
});
