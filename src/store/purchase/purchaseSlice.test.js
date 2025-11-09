import { describe, it, expect, vi } from "vitest";

vi.mock("../../api/purchase.js", () => ({
  default: {
    createCart: vi.fn().mockReturnValue(Promise.resolve({
      id: 1,
      reservationTime: new Date(Date.now() + 10000).toISOString(),
      status: "PENDING",
    })),
    cancelPurchase: vi.fn().mockReturnValue(Promise.resolve({})),
  },
}));

import reducer, {
  tick,
  createCart,
  confirmPurchase,
  cancelPurchase,
  clearPurchase,
} from "./purchaseSlice";

const initialState = {
  id: null,
  reservationTimestamp: null,
  status: "idle",
  timeLeft: 0,
  endTime: null,
};

describe("purchaseSlice", () => {
  it("handles createCart.fulfilled", () => {
    const base = Date.now();
    const reservationTimestamp = new Date(base + 10000).toISOString();
    const payload = { id: 1, reservationTime: reservationTimestamp, status: "PENDING" };
    const spy = vi.spyOn(Date, "now").mockReturnValue(base);
    const state = reducer(initialState, createCart.fulfilled(payload));
    expect(state).toEqual({
      id: 1,
      reservationTimestamp,
      status: "PENDING",
      timeLeft: 1810,
      endTime: base + 1810000,
    });
    spy.mockRestore();
  });

  it("counts down and expires", () => {
    let state = {
      id: 1,
      reservationTimestamp: new Date(Date.now() + 10000).toISOString(),
      status: "PENDING",
      timeLeft: 1,
    };
    state = reducer(state, tick());
    expect(state.timeLeft).toBe(0);
    expect(state.status).toBe("expired");
  });

  it("clears on confirm", () => {
    const start = {
      id: 1,
      reservationTimestamp: new Date(Date.now() + 10000).toISOString(),
      status: "PENDING",
      timeLeft: 5,
    };
    const state = reducer(start, confirmPurchase.fulfilled());
    expect(state).toEqual(initialState);
  });

  it("clears on cancel", () => {
    const start = {
      id: 1,
      reservationTimestamp: new Date(Date.now() + 10000).toISOString(),
      status: "PENDING",
      timeLeft: 5,
    };
    const state = reducer(start, cancelPurchase.fulfilled());
    expect(state).toEqual(initialState);
  });

  it("clears via clearPurchase action", () => {
    const start = {
      id: 1,
      reservationTimestamp: new Date(Date.now() + 10000).toISOString(),
      status: "PENDING",
      timeLeft: 5,
    };
    const state = reducer(start, clearPurchase());
    expect(state).toEqual(initialState);
  });

  it("stops timer on cancelPurchase", async () => {
    vi.useFakeTimers();
    const setSpy = vi.spyOn(globalThis, "setInterval");
    const clearSpy = vi.spyOn(globalThis, "clearInterval");

    let state = { ...initialState };
    const getState = () => ({ cart: { items: [{ id: 1, quantity: 1 }] }, purchase: state });

    const dispatch = (action) => {
      if (typeof action === "function") {
        return action(dispatch, getState);
      }
      state = reducer(state, action);
      return action;
    };

    await createCart()(dispatch, getState);
    expect(setSpy).toHaveBeenCalled();

    await cancelPurchase()(dispatch, getState);
    expect(clearSpy).toHaveBeenCalled();
    expect(state).toEqual(initialState);

    vi.useRealTimers();
  });
});
