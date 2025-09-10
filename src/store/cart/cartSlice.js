import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import purchaseService from "../../api/purchase.js";

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

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  return await purchaseService.fetchCart();
});

export const clearCartOnServer = createAsyncThunk(
  "cart/clearCartOnServer",
  async () => {
    await purchaseService.clearCart();
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const qty = item.quantity ?? 1;
      if (qty < 1) return;
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += qty;
      } else {
        state.items.push({ ...item, quantity: qty });
      }
      calcTotals(state);
      saveState(state);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      calcTotals(state);
      saveState(state);
    },
    incrementItem: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity += 1;
        calcTotals(state);
        saveState(state);
      }
    },
    decrementItem: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        calcTotals(state);
        saveState(state);
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity < 1) return;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = quantity;
        calcTotals(state);
        saveState(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      calcTotals(state);
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      const items = action.payload?.items ?? [];
      state.items = items;
      calcTotals(state);
      saveState(state);
    });
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  incrementItem,
  decrementItem,
} = cartSlice.actions;

export const addItemIfLoggedIn = (item) => (dispatch, getState) => {
  if (getState().user?.isLoggedIn) {
    dispatch(addItem(item));
  }
};

export default cartSlice.reducer;
