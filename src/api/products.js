import { request } from "./axios.js";

export const searchProducts = async (query, signal) => {
  const response = await request.get(`/products/search?query=${encodeURIComponent(query)}`, { signal });
  return response.data;
};
