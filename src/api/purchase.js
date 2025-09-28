import { api } from "./axios.js";

const purchaseService = {
  createCart: async (items) => {
    const mappedItems = items.map((item) => ({
      product: { id: item.id },
      quantity: item.quantity,
    }));
    const res = await api.post("/cart", { items: mappedItems });
    const { id, date, reservationTime, status } = res.data;
    return { id, date, reservationTime, status };
  },
  fetchCart: async () => {
    const res = await api.get("/cart");
    return res.data;
  },
  clearCart: async () => {
    const res = await api.delete("/cart");
    return res.data;
  },
  createPurchase: async (data) => {
    const res = await api.post("/purchase", data);
    return res.data;
  },
  confirmPurchase: async (id, addressId) => {
    const path = addressId != null ? `/purchase/${id}/confirm/${addressId}` : `/purchase/${id}/confirm`;
    const res = await api.post(path);
    return res.data;
  },
  cancelPurchase: async (id) => {
    const res = await api.delete(`/purchase/${id}`);
    return res.data;
  },
  fetchPurchase: async (id) => {
    const res = await api.get(`/purchase/${id}`);
    return res.data;
  },
  fetchUserPurchases: async () => {
    const res = await api.get('/purchase/user-purchases');
    return res.data;
  },
};

export default purchaseService;
