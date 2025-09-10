import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

// --- Helper HTTP usando el cliente ya existente ---
async function getJSON(url) {
  const res = await api.get(url);
  console.log("getJSON", url, res.data);
  return res.data;
}

// --- Normalización de categorías (aplica a 1 o N productos) ---
function normalizeWithCategories(rawProducts, categories = []) {
  const categoriesById = Object.create(null);
  for (const c of categories) categoriesById[c.id] = c;

  const toNorm = (p) => {
    const hasEmbeddedCats =
      Array.isArray(p.categories) && p.categories.every((c) => c && typeof c === "object");

    let categoriesList;
    if (hasEmbeddedCats) {
      categoriesList = p.categories;
    } else {
      const ids = Array.isArray(p.categoryIds)
        ? p.categoryIds
        : p.categoryId != null
        ? [p.categoryId]
        : [];

      categoriesList = ids.map((id) => categoriesById[id]).filter(Boolean);
      if (ids.length && categoriesList.length === 0) {
        // consola útil si hay data huérfana
        // eslint-disable-next-line no-console
        console.warn("Category not found for product", p.id, ids);
      }
    }

    const { categoryId, categoryIds, categories: _cats, ...rest } = p;
    // compat: expone category = primera categoría
    const primary = categoriesList[0];
    return { ...rest, categories: categoriesList, category: primary };
  };

  return Array.isArray(rawProducts) ? rawProducts.map(toNorm) : toNorm(rawProducts);
}

// --- Thunks ---
// A) Lista completa con categorías fusionadas (preferido por la app)
export const fetchProductsWithCategories = createAsyncThunk(
  "products/fetchAllWithCategories",
  async () => {
    const rawProducts = await getJSON("/products");
    console.log("rawProducts", rawProducts);
    const needsCats = !rawProducts.every(
      (p) => Array.isArray(p.categories) && p.categories.every((c) => c && typeof c === "object")
    );
    if (needsCats) {
      const categories = await getJSON("/categories");
      return normalizeWithCategories(rawProducts, categories);
    }
    return normalizeWithCategories(rawProducts);
  }
);

// B) Lista “simple” (backcompat). Igual normalizamos para no romper componentes.
export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const rawProducts = await getJSON("/products");
  const needsCats = !rawProducts.every(
    (p) => Array.isArray(p.categories) && p.categories.every((c) => c && typeof c === "object")
  );
  if (needsCats) {
    const categories = await getJSON("/categories");
    return normalizeWithCategories(rawProducts, categories);
  }
  return normalizeWithCategories(rawProducts);
});

// C) Uno por id con productos relacionados
export const fetchProduct = createAsyncThunk("products/fetchOne", async (id) => {
  const { product: rawProduct, relatedProducts = [] } = await getJSON(`/products/${id}`);
  const all = [rawProduct, ...relatedProducts];
  const needsCats = !all.every(
    (p) => Array.isArray(p.categories) && p.categories.every((c) => c && typeof c === "object")
  );
  if (needsCats) {
    const categories = await getJSON("/categories");
    const [product, ...related] = normalizeWithCategories(all, categories);
    return { product, relatedProducts: related };
  }
  const [product, ...related] = normalizeWithCategories(all);
  return { product, relatedProducts: related };
});

// --- Estado ---
const initialState = {
  items: [],
  current: null,
  related: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

// --- Slice ---
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Permite hidratar manualmente (tests/SSR)
    setProducts: (state, action) => {
      state.items = action.payload ?? [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProductsWithCategories (lista preferida)
      .addCase(fetchProductsWithCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductsWithCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProductsWithCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Error al cargar productos";
      })

      // fetchProducts (lista “simple” pero normalizada)
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Error al cargar productos";
      })

      // fetchProduct (uno)
      .addCase(fetchProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.current = null; // evita mostrar un detalle viejo
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload.product;
        state.related = action.payload.relatedProducts;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Error al cargar el producto";
      });
  },
});

export const { setProducts } = productsSlice.actions;
export default productsSlice.reducer;

// --- Selectores ---
export const selectAllProducts = (state) => state.products.items;

export const selectProductById = (id) =>
  createSelector(selectAllProducts, (items) => items.find((p) => String(p.id) === String(id)) || null);

export const selectRelatedProducts = (state) => state.products.related;
