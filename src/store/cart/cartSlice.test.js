import { describe, it, expect, beforeEach } from "vitest";
import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  incrementItem,
  decrementItem,
  addItemIfLoggedIn,
} from "./cartSlice";
import userReducer from "../user/userSlice";
import { configureStore } from "@reduxjs/toolkit";

describe("cartSlice", () => {
  beforeEach(() => {
    global.localStorage = {
      getItem: () => null,
      setItem: () => null,
    };
  });

  it("should return the initial state", () => {
    const state = cartReducer(undefined, { type: "unknown" });
    expect(state).toEqual({ items: [], totalQuantity: 0, totalAmount: 0 });
  });

  it("should add an item", () => {
    const state = cartReducer(
      undefined,
      addItem({ id: 1, title: "Test", price: 10 })
    );
    expect(state.items).toHaveLength(1);
    expect(state.totalQuantity).toBe(1);
    expect(state.totalAmount).toBe(10);
  });

  it("should add an item with quantity", () => {
    const state = cartReducer(
      undefined,
      addItem({ id: 2, title: "Bulk", price: 5, quantity: 3 })
    );
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
    expect(state.totalQuantity).toBe(3);
    expect(state.totalAmount).toBe(15);
  });

  it("should update quantity", () => {
    const state = cartReducer(
      { items: [{ id: 1, title: "Test", price: 10, quantity: 1 }], totalQuantity: 1, totalAmount: 10 },
      updateQuantity({ id: 1, quantity: 3 })
    );
    expect(state.items[0].quantity).toBe(3);
    expect(state.totalQuantity).toBe(3);
    expect(state.totalAmount).toBe(30);
  });

  it("should increment item quantity", () => {
    const state = cartReducer(
      { items: [{ id: 1, title: "Test", price: 10, quantity: 1 }], totalQuantity: 1, totalAmount: 10 },
      incrementItem(1)
    );
    expect(state.items[0].quantity).toBe(2);
    expect(state.totalQuantity).toBe(2);
    expect(state.totalAmount).toBe(20);
  });

  it("should decrement item quantity", () => {
    const state = cartReducer(
      { items: [{ id: 1, title: "Test", price: 10, quantity: 2 }], totalQuantity: 2, totalAmount: 20 },
      decrementItem(1)
    );
    expect(state.items[0].quantity).toBe(1);
    expect(state.totalQuantity).toBe(1);
    expect(state.totalAmount).toBe(10);
  });

  it("should not add item with invalid quantity", () => {
    const state = cartReducer(
      undefined,
      addItem({ id: 3, title: "Bad", price: 10, quantity: 0 })
    );
    expect(state.items).toHaveLength(0);
    expect(state.totalQuantity).toBe(0);
    expect(state.totalAmount).toBe(0);
  });

  it("should ignore update with invalid quantity", () => {
    const state = cartReducer(
      { items: [{ id: 1, title: "Test", price: 10, quantity: 2 }], totalQuantity: 2, totalAmount: 20 },
      updateQuantity({ id: 1, quantity: 0 })
    );
    expect(state.items[0].quantity).toBe(2);
    expect(state.totalQuantity).toBe(2);
    expect(state.totalAmount).toBe(20);
  });

  it("should remove item", () => {
    const state = cartReducer(
      { items: [{ id: 1, title: "Test", price: 10, quantity: 1 }], totalQuantity: 1, totalAmount: 10 },
      removeItem(1)
    );
    expect(state.items).toHaveLength(0);
    expect(state.totalQuantity).toBe(0);
    expect(state.totalAmount).toBe(0);
  });

  it("should clear cart", () => {
    const state = cartReducer(
      { items: [{ id: 1, title: "Test", price: 10, quantity: 1 }], totalQuantity: 1, totalAmount: 10 },
      clearCart()
    );
    expect(state.items).toHaveLength(0);
    expect(state.totalQuantity).toBe(0);
    expect(state.totalAmount).toBe(0);
  });
});

describe("cartSlice integration", () => {
  beforeEach(() => {
    global.localStorage = {
      getItem: () => null,
      setItem: () => null,
    };
  });

  it("allows adding, adjusting and removing items via store when logged in", () => {
    const store = configureStore({
      reducer: { cart: cartReducer, user: userReducer },
      preloadedState: { user: { isLoggedIn: true } },
    });
    store.dispatch(addItemIfLoggedIn({ id: 1, title: "Test", price: 5 }));
    store.dispatch(incrementItem(1));
    expect(store.getState().cart.totalAmount).toBe(10);
    store.dispatch(decrementItem(1));
    expect(store.getState().cart.totalAmount).toBe(5);
    store.dispatch(removeItem(1));
    expect(store.getState().cart.items).toHaveLength(0);
  });

  it("prevents adding items when not logged in", () => {
    const store = configureStore({
      reducer: { cart: cartReducer, user: userReducer },
      preloadedState: { user: { isLoggedIn: false } },
    });
    store.dispatch(addItemIfLoggedIn({ id: 1, title: "Test", price: 5 }));
    expect(store.getState().cart.items).toHaveLength(0);
  });
});
