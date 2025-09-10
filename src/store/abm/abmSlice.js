import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/productsApi";

export const getProducts = createAsyncThunk("abm/getAll", async () => {
  const res = await api.fetchProducts();
  return res.data;
});

export const editProduct = createAsyncThunk("abm/updateProduct", async (product) => {
  const res = await api.updateProduct(product);
  return res.data;
})

export const getCategories = createAsyncThunk("abm/getAllCategories", async () => {
  const res = await api.fetchCategories();
  return res.data;
})

export const getBrands = createAsyncThunk("abm/getAllBrands", async () => {
  const res = await api.fetchBrands();
  return res.data;
})

export const deleteProduct = createAsyncThunk("abm/deleteProduct", async (productCode) => {
  const res = await api.deleteProduct(productCode);
  return productCode;
})

export const createProduct = createAsyncThunk("abm/createProduct", async (product) => {
  const res = await api.createProduct(product)
  return res.data;
})

export const uploadFile = createAsyncThunk("abm/uploadFile", async (file) => {
  const res = await api.uploadBatch(file);
  console.log(res);
  return res.data;
})

export const createCategory = createAsyncThunk("abm/createCategory", async (category) => {
  const res = await api.createCategory(category);
  console.log('Categoria creada! RTA:', res.data);
  return res.data;
})

export const deleteCategory = createAsyncThunk("abm/deleteCategory", async (id) => {
  const res = await api.deleteCategory(id);
  console.log('Categoria eliminada! RTA:', res.data);
  return id;
})

export const createBrand = createAsyncThunk("abm/createBrand", async (brand) => {
  const res = await api.createBrand(brand);
  console.log('Marca creada! RTA:', res.data);
  return res.data;
})

export const deleteBrand = createAsyncThunk("abm/deleteBrand", async (id) => {
  const res = await api.deleteBrand(id);
  console.log('Marca eliminada! RTA:', res.data);
  return id;
})


const abmSlice = createSlice({
  name: "abm",
  initialState: { items: [], status: "idle", error: null, categories: [], brands: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.items.findIndex(
          (p) => p.productCode === updatedProduct.productCode
        );
        if (index !== -1) {
          state.items[index] = updatedProduct;
        }
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const productCode = action.payload;
        const index = state.items.findIndex(
          (p) => p.productCode === productCode
        );
        if (index !== -1) {
          state.items[index].active = false;
        }
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const categoryCode = action.payload;
        const index = state.categories.findIndex(
          (c) => c.id === categoryCode
        )
        if (index !== 1) {
          state.categories[index].active = false;
        }
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.brands.push(action.payload);
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        const brandCode = action.payload;
        const index = state.brands.findIndex(
          (b) => b.id === brandCode
        )
        if (index !== 1) {
          state.brands[index].active = false;
        }
      })
  },
});

export default abmSlice.reducer;
