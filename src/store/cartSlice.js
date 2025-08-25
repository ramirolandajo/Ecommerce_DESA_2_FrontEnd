import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  if (typeof localStorage === "undefined") {
    return { items: [], totalQuantity: 0, totalAmount: 0 };
  }
  try {
    const stored = localStorage.getItem("cart");
    return stored
      ? JSON.parse(stored)
      : { items: [], totalQuantity: 0, totalAmount: 0 };
  } catch {
    return { items: [], totalQuantity: 0, totalAmount: 0 };
  }
};

const saveState = (state) => {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch {
    // ignore write errors
  }
};

const calcTotals = (state) => {
  state.totalQuantity = state.items.reduce((acc, i) => acc + i.quantity, 0);
  state.totalAmount = state.items.reduce(
    (acc, i) => acc + i.quantity * (i.price ?? 0),
    0,
  );
};

const initialState = getInitialState();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity ?? 1;
      } else {
        state.items.push({ ...item, quantity: item.quantity ?? 1 });
      }
      calcTotals(state);
      saveState(state);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      calcTotals(state);
      saveState(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = quantity;
      }
      calcTotals(state);
      saveState(state);
    },
    clearCart: (state) => {
      state.items = [];
      calcTotals(state);
      saveState(state);
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
