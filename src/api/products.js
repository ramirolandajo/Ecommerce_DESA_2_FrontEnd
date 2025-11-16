import { request } from "./axios.js";

export const searchProducts = async (query) => {
  const response = await request.get(`/products/search?query=${encodeURIComponent(query)}`);
  return response.data;
};
