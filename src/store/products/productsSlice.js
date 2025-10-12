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

// --- Estado ---
const initialState = {
  items: [],
  current: null,
  related: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  pagination: {
    page: 0,
    size: 24, // Cambiado a 24 por página
    totalPages: 1,
    totalElements: 0,
    numberOfElements: 0,
    first: true,
    last: true,
  },
  home: undefined, // Estado para datos de la pantalla principal
};

// --- Thunks ---
// A) Lista completa con categorías fusionadas (preferido por la app)
export const fetchProductsWithCategories = createAsyncThunk(
  "products/fetchAllWithCategories",
  async (params = {}) => {
    const { page = 0, size = 24 } = params; // Cambiado default a 24
    let rawResponse = await getJSON(`/products?page=${page}&size=${size}`);
    let rawProducts = rawResponse;
    // Aseguramos que sea un array
    if (!Array.isArray(rawProducts)) {
      if (rawProducts && Array.isArray(rawProducts.content)) {
        rawProducts = rawProducts.content;
      } else if (rawProducts && Array.isArray(rawProducts.products)) {
        rawProducts = rawProducts.products;
      } else {
        console.error("La respuesta de /products no es un array ni contiene 'content' ni 'products'.", rawProducts);
        rawProducts = [];
      }
    }
    const needsCats = !rawProducts.every(
      (p) => Array.isArray(p.categories) && p.categories.every((c) => c && typeof c === "object")
    );
    let normalized;
    if (needsCats) {
      const categories = await getJSON("/categories");
      normalized = normalizeWithCategories(rawProducts, categories);
    } else {
      normalized = normalizeWithCategories(rawProducts);
    }
    return {
      items: normalized,
      pagination: {
        page: rawResponse.pageable?.pageNumber ?? 0,
        size: rawResponse.pageable?.pageSize ?? normalized.length,
        totalPages: rawResponse.totalPages ?? 1,
        totalElements: rawResponse.totalElements ?? normalized.length,
        numberOfElements: rawResponse.numberOfElements ?? normalized.length,
        first: rawResponse.first ?? true,
        last: rawResponse.last ?? true,
      },
    };
  }
);

// B) Lista “simple” (backcompat). Igual normalizamos para no romper componentes.
export const fetchProducts = createAsyncThunk("products/fetchAll", async (params = {}) => {
  const { page = 0, size = 24 } = params; // Cambiado default a 24
  let rawResponse = await getJSON(`/products?page=${page}&size=${size}`);
  let rawProducts = rawResponse;
  // Aseguramos que sea un array
  if (!Array.isArray(rawProducts)) {
    if (rawProducts && Array.isArray(rawProducts.content)) {
      rawProducts = rawProducts.content;
    } else if (rawProducts && Array.isArray(rawProducts.products)) {
      rawProducts = rawProducts.products;
    } else {
      console.error("La respuesta de /products no es un array ni contiene 'content' ni 'products'.", rawProducts);
      rawProducts = [];
    }
  }
  const needsCats = !rawProducts.every(
    (p) => Array.isArray(p.categories) && p.categories.every((c) => c && typeof c === "object")
  );
  let normalized;
  if (needsCats) {
    const categories = await getJSON("/categories");
    normalized = normalizeWithCategories(rawProducts, categories);
  } else {
    normalized = normalizeWithCategories(rawProducts);
  }
  return {
    items: normalized,
    pagination: {
      page: rawResponse.pageable?.pageNumber ?? 0,
      size: rawResponse.pageable?.pageSize ?? normalized.length,
      totalPages: rawResponse.totalPages ?? 1,
      totalElements: rawResponse.totalElements ?? normalized.length,
      numberOfElements: rawResponse.numberOfElements ?? normalized.length,
      first: rawResponse.first ?? true,
      last: rawResponse.last ?? true,
    },
  };
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

// D) Nuevos thunks para la pantalla principal
// Añadir soporte para /homescreen: thunk que devuelve { hero: [...], items: [...] }
export const fetchHomeProducts = createAsyncThunk(
  "products/fetchHome",
  async () => {
    const raw = await getJSON("/homescreen");

    // Aceptar varias formas de respuesta: { hero, products } | { hero, tiles } | array (items)
    const heroRaw = Array.isArray(raw?.hero) ? raw.hero : Array.isArray(raw?.slides) ? raw.slides : [];
    let itemsRaw = [];

    if (Array.isArray(raw?.products)) itemsRaw = raw.products;
    else if (Array.isArray(raw?.tiles)) itemsRaw = raw.tiles;
    else if (Array.isArray(raw?.items)) itemsRaw = raw.items;
    else if (Array.isArray(raw)) itemsRaw = raw;

    // Normalizar categorías de forma consistente: si alguno de los productos no tiene categorias embebidas, obtener /categories
    const allToCheck = [...heroRaw, ...itemsRaw];
    const needsCats = !allToCheck.every(
      (p) => Array.isArray(p.categories) && p.categories.every((c) => c && typeof c === "object")
    );

    let categories = [];
    if (needsCats) {
      categories = await getJSON("/categories");
    }

    const normalizedHero = normalizeWithCategories(heroRaw, categories);
    const normalizedItems = normalizeWithCategories(itemsRaw, categories);

    return { hero: normalizedHero, items: normalizedItems };
  }
);

// --- Slice ---
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Permite hidratar manualmente (tests/SSR)
    setProducts: (state, action) => {
      state.items = action.payload?.items ?? [];
      state.pagination = action.payload?.pagination ?? initialState.pagination;
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
        state.items = action.payload.items; // Siempre reemplaza
        state.pagination = action.payload.pagination;
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
        state.items = action.payload.items; // Siempre reemplaza
        state.pagination = action.payload.pagination;
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
      })

      // fetchHomeProducts (nuevo endpoint optimizado para pantalla principal)
      .addCase(fetchHomeProducts.pending, (state) => {
        // inicializar sub-estado home si no existe
        state.home = state.home ?? { items: [], hero: [], status: "idle", error: null };
        state.home.status = "loading";
        state.home.error = null;
      })
      .addCase(fetchHomeProducts.fulfilled, (state, action) => {
        state.home = state.home ?? { items: [], hero: [], status: "idle", error: null };
        state.home.status = "succeeded";
        state.home.items = action.payload.items;
        state.home.hero = action.payload.hero;
      })
      .addCase(fetchHomeProducts.rejected, (state, action) => {
        state.home = state.home ?? { items: [], hero: [], status: "idle", error: null };
        state.home.status = "failed";
        state.home.error = action.error?.message || "Error al cargar home";
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

// --- Selectores del home ---
export const selectHomeProducts = (state) => state.products.home?.items ?? state.products.items;
export const selectHomeHero = (state) => state.products.home?.hero ?? (state.products.items || []).filter((p) => p.hero);
export const selectHomeStatus = (state) => state.products.home?.status ?? state.products.status;

