import axios from "axios";

//const API_URL = `${import.meta.env.VITE_API_BASE_URL}/products`;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4002';

// Crear instancia de Axios con autenticación básica
const api = axios.create({
  baseURL: API_URL,
});

// Funciones usando la instancia
export const fetchProducts = () => api.get('/products/getAll');
export const fetchProductByCode = (code) => api.get(`/products/getProductByCode/${code}`);
export const createProduct = (product) => api.post('/products/create', product);
export const updateProduct = (product) => api.put(`/products/update`, product);
export const updateStock = (code, stock) => api.patch(`/products/updateStock/${code}`, { newStock: stock });
export const updateUnitPrice = (code, unitPrice) => api.patch(`/products/updateUnitPrice/${code}`, { newPrice: unitPrice });
export const updateDiscount = (code, discount) => api.patch(`/products/updateDiscount/${code}`, { newDiscount: discount });
export const deleteProduct = (code) => api.delete(`/products/delete/${code}`);
export const uploadBatch = (fileCSV) => {
  const formData = new FormData();
  formData.append('file', fileCSV);
  return api.post('/products/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const fetchCategories = () => api.get('/category/getAll');
export const createCategory = (category) => api.post('/category/create', {name: category, active: true});
export const deleteCategory = (id) => api.delete(`/category/delete/${id}`);

export const fetchBrands = () => api.get('/brand/getAll');
export const createBrand = (brand) => api.post('/brand/create', {name: brand, active: true});
export const deleteBrand = (id) => api.delete(`/brand/delete/${id}`);