// src/api/reviews.js
import { api } from "./axios";

export async function addReview(productCode, { calification, description }) {
  const payload = { calification, description };
  // El backend expone POST /code/{productCode}/review
  const res = await api.post(`products/code/${productCode}/review`, payload);
  return res.data;
}

export async function getMyReview(productCode) {
  try {
    const res = await api.get(`products/code/${productCode}/review/me`);
    return res.data; // se asume que devuelve la review creada o un objeto ReviewDTO
  } catch (err) {
    // 404 -> no existe review del usuario para ese producto
    if (err?.response?.status === 404) return null;
    // 401 -> no autenticado
    if (err?.response?.status === 401) return null;
    // rethrow other errors
    throw err;
  }
}

// Nueva función para obtener todas las reseñas de un producto
export async function getReviews(productId) {
  const res = await api.get(`products/${productId}/reviews`);
  return res.data; // se espera el ReviewResponse del backend
}

export default { addReview, getMyReview, getReviews };
