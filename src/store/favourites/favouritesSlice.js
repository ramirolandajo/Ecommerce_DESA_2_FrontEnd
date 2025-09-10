import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import favouritesApi from "../../api/favourites.js";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchFavourites = createAsyncThunk(
  "favourites/fetchFavourites",
  async () => {
    return await favouritesApi.getFavouriteProducts();
  },
);

export const addFavourite = createAsyncThunk(
  "favourites/addFavourite",
  async (productCode, { getState }) => {
    await favouritesApi.addFavouriteProduct(productCode);
    // Buscar el producto en el store de productos
    const state = getState();
    // Puede estar en products.list o products.items según la estructura
    const productsList = state.products.list || state.products.items || [];
    const product = productsList.find((p) => String(p.productCode) === String(productCode));
    return product;
  },
);

export const removeFavourite = createAsyncThunk(
  "favourites/removeFavourite",
  async (productCode, { getState }) => {
    await favouritesApi.removeFavouriteProduct(productCode);
    // Buscar el id en el array de favoritos actual
    const state = getState();
    const fav = state.favourites.items.find((item) => String(item.productCode) === String(productCode));
    return fav ? fav.id : productCode; // Si no lo encuentra, retorna el productCode
  },
);

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavourites.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload ?? [];
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addFavourite.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default favouritesSlice.reducer;
