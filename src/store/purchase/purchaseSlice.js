import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import purchaseService from "../../api/purchase.js";

export const tick = createAction("purchase/tick");

let timer = null;

const initialState = {
  id: null,
  reservationTimestamp: null,
  endTime: null,
  status: "idle",
  timeLeft: 0,
};

export const createCart = createAsyncThunk(
  "purchase/createCart",
  async (_, { getState, dispatch }) => {
    const { items } = getState().cart;
    const simplified = items.map(({ id, quantity }) => ({ id, quantity }));
    const data = await purchaseService.createCart(simplified);
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      dispatch(tick());
    }, 1000);
    return data;
  },
);

export const confirmPurchase = createAsyncThunk(
  "purchase/confirmPurchase",
  async (addressId, { getState }) => {
    const id = getState().purchase.id;
    return await purchaseService.confirmPurchase(id, addressId);
  },
);

export const cancelPurchase = createAsyncThunk(
  "purchase/cancelPurchase",
  async (_, { getState }) => {
    const id = getState().purchase.id;
    return await purchaseService.cancelPurchase(id);
  },
);

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    clearPurchase: () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(tick, (state) => {
        if (state.endTime) {
          state.timeLeft = Math.max(0, Math.floor((state.endTime - Date.now()) / 1000));
        } else {
          if (state.timeLeft > 0) {
            state.timeLeft -= 1;
          }
        }
        if (state.timeLeft <= 0) {
          state.status = "expired";
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
        }
        console.log("tick", state.timeLeft);
      })
      .addCase(createCart.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.reservationTimestamp = action.payload.reservationTime;
        state.endTime = new Date(action.payload.reservationTime).getTime() + 30 * 60 * 1000;
        state.status = action.payload.status;
        state.timeLeft = Math.max(0, Math.floor((state.endTime - Date.now()) / 1000));
        console.log("createCart.fulfilled", action.payload, "endTime", new Date(state.endTime), "timeLeft", state.timeLeft);
      })
      .addCase(confirmPurchase.fulfilled, () => {
        console.log("confirmPurchase.fulfilled");
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        return { ...initialState };
      })
      .addCase(cancelPurchase.fulfilled, () => {
        console.log("cancelPurchase.fulfilled");
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        return { ...initialState };
      });
  },
});

export const { clearPurchase } = purchaseSlice.actions;
export default purchaseSlice.reducer;
