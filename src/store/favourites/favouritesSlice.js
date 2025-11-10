import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import favouritesApi from "../../api/favourites.js";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchFavourites = createAsyncThunk(
  "favourites/fetchFavourites",
  async (_, { getState }) => {
    const items = await favouritesApi.getFavouriteProducts();
    console.log("fetchFavourites", items);
    const state = getState();
    const productsList = state.products?.list || state.products?.items || [];
    // Mapear cada producto devuelto por el backend y, si encontramos el mismo producto en
    // el store de products, adjuntamos productCode para mantener consistencia en el front
    const normalized = (Array.isArray(items) ? items : []).map((p) => {
      const match = productsList.find((prod) => String(prod.id) === String(p.id));
      if (match && match.productCode) {
        return { ...p, productCode: match.productCode };
      }
      return p;
    });
    return normalized;
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
    // Si no encontramos el producto en el store local, retornamos un objeto con productCode
    // y un id provisional (el backend suele devolver un id, pero aquí garantizamos coherencia)
    if (product) return product;
    return { id: productCode, productCode };
  },
);

export const removeFavourite = createAsyncThunk(
  "favourites/removeFavourite",
  async (productIdentifier, { getState }) => {
    // productIdentifier puede ser productCode (externo) o product.id (interno)
    const state = getState();
    const productsList = state.products.list || state.products.items || [];

    // Intentamos resolver el productCode a enviar al backend:
    // 1) Si ya viene un product con productCode igual, lo usamos
    let product = productsList.find((p) => String(p.productCode) === String(productIdentifier));
    let productCodeToSend = product ? product.productCode : undefined;

    // 2) Si no, puede que nos hayan pasado el product.id; buscamos por id y tomamos su productCode
    if (!productCodeToSend) {
      product = productsList.find((p) => String(p.id) === String(productIdentifier));
      if (product && product.productCode) productCodeToSend = product.productCode;
    }

    // 3) Como fallback, revisamos los favoritos actuales por si almacenan productCode
    if (!productCodeToSend && Array.isArray(state.favourites?.items)) {
      const fav = state.favourites.items.find((it) => String(it.id) === String(productIdentifier) || String(it.productCode) === String(productIdentifier));
      if (fav && fav.productCode) productCodeToSend = fav.productCode;
    }

    // 4) Si aún no lo resolvimos, enviamos el identificador tal cual (podría fallar en backend)
    if (!productCodeToSend) productCodeToSend = productIdentifier;

    await favouritesApi.removeFavouriteProduct(productCodeToSend);

    // Retornamos información suficiente para que el reducer elimine el item correcto
    return {
      removedProductCode: productCodeToSend,
      removedProductId: product?.id ?? null,
      originalIdentifier: productIdentifier,
    };
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
        // Protección: sólo agregamos si payload es válido y no existe ya
        const payload = action.payload;
        if (!payload) return;
        const existing = state.items.find((it) => String(it.productCode ?? it.id) === String(payload.productCode ?? payload.id));
        if (!existing) state.items.push(payload);
      })
      .addCase(removeFavourite.fulfilled, (state, action) => {
        const payload = action.payload || {};
        const { removedProductCode, removedProductId, originalIdentifier } = payload;
        state.items = state.items.filter((item) => {
          // eliminamos si coincide el id interno
          if (removedProductId && String(item.id) === String(removedProductId)) return false;
          // o si coincide productCode (o fallback a id)
          if (removedProductCode && String(item.productCode ?? item.id) === String(removedProductCode)) return false;
          // o si coincide el identificador original pasado desde la UI
          if (originalIdentifier && (String(item.id) === String(originalIdentifier) || String(item.productCode) === String(originalIdentifier))) return false;
          return true;
        });
      });
  },
});

export default favouritesSlice.reducer;
