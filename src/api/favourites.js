import { api } from "./axios";

// Helper to attach Authorization header with JWT token
const authConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getFavouriteProducts = async () => {
  const res = await api.get("/products/user/favourite-products", authConfig());
  return res.data;
};

export const addFavouriteProduct = async (productCode) => {
  const res = await api.post(
    `/products/favourite/${productCode}`,
    {},
    authConfig()
  );
  return res.data;
};

export const removeFavouriteProduct = async (productCode) => {
  const res = await api.delete(`/products/favourite/${productCode}`, authConfig());
  return res.data;
};

export default {
  getFavouriteProducts,
  addFavouriteProduct,
  removeFavouriteProduct,
};
