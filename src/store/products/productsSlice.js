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

    const { categoryId: _categoryId, categoryIds: _categoryIds, categories: _cats, ...rest } = p;
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
      if (rawProducts && Array.isArray(rawResponse.content)) {
        rawProducts = rawResponse.content;
      } else if (rawResponse && Array.isArray(rawResponse.products)) {
        rawProducts = rawResponse.products;
      } else {
        console.error("La respuesta de /products no es un array ni contiene 'content' ni 'products'.", rawResponse);
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
    if (rawResponse && Array.isArray(rawResponse.content)) {
      rawProducts = rawResponse.content;
    } else if (rawResponse && Array.isArray(rawResponse.products)) {
      rawProducts = rawResponse.products;
    } else {
      console.error("La respuesta de /products no es un array ni contiene 'content' ni 'products'.", rawResponse);
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

// C) Nuevo thunk: fetchFilteredProducts -> POST /products/filter
export const fetchFilteredProducts = createAsyncThunk(
  "products/fetchFiltered",
  async (params = {}) => {
    // params puede contener: page,size, priceMin, priceMax, brandCode, categoryCode, brandCodes, categoryCodes, sortBy, sortOrder
    const {
      page = 0,
      size = 24,
      priceMin = null,
      priceMax = null,
      brandCode = null,
      categoryCode = null,
      brandCodes = null,
      categoryCodes = null,
      sortBy = null,
      sortOrder = null,
    } = params;

    const body = {
      priceMin: priceMin == null || priceMin === "" ? null : Number(priceMin),
      priceMax: priceMax == null || priceMax === "" ? null : Number(priceMax),
      // Si vienen brandCodes (array no vacío) los enviamos; si no, enviamos brandCode simple
      brandCodes: Array.isArray(brandCodes) && brandCodes.length ? brandCodes : null,
      brandCode: Array.isArray(brandCodes) && brandCodes.length ? null : (brandCode == null || brandCode === "" ? null : brandCode),
      // Igual para categories
      categoryCodes: Array.isArray(categoryCodes) && categoryCodes.length ? categoryCodes : null,
      categoryCode: Array.isArray(categoryCodes) && categoryCodes.length ? null : (categoryCode == null || categoryCode === "" ? null : categoryCode),
      sortBy: sortBy || null,
      sortOrder: sortOrder || null,
      page,
      size,
    };

    // Hacemos la petición POST
    const res = await api.post("/products/filter", body);
    const rawResponse = res.data;
    // El backend devuelve una página: content + pageable / totalPages etc.
    const rawProducts = Array.isArray(rawResponse)
      ? rawResponse
      : Array.isArray(rawResponse.content)
      ? rawResponse.content
      : Array.isArray(rawResponse.products)
      ? rawResponse.products
      : [];

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
        page: rawResponse.pageable?.pageNumber ?? page,
        size: rawResponse.pageable?.pageSize ?? size,
        totalPages: rawResponse.totalPages ?? 1,
        totalElements: rawResponse.totalElements ?? normalized.length,
        numberOfElements: rawResponse.numberOfElements ?? normalized.length,
        first: rawResponse.first ?? (page === 0),
        last: rawResponse.last ?? false,
      },
    };
  }
);

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

      // fetchFilteredProducts
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items; // Siempre reemplaza con la página filtrada
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Error al cargar productos filtrados";
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

