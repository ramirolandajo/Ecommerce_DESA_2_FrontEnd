import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../api/axios.js", () => {
  return {
    api: { post: vi.fn(), get: vi.fn(), delete: vi.fn() },
  };
});

import purchaseService from "../api/purchase.js";
import { api } from "../api/axios.js";

describe("purchaseService", () => {
  beforeEach(() => {
    api.post.mockReset();
    api.get.mockReset();
    api.delete.mockReset();
  });

  it("creates cart", async () => {
    const data = {
      id: 1,
      date: "2024-01-01",
      reservationTime: "12:00",
      status: "PENDING",
    };
    api.post.mockResolvedValue({ data });
    const res = await purchaseService.createCart([{ id: 1, quantity: 2 }]);
    expect(api.post).toHaveBeenCalledWith("/cart", {
      items: [{ product: { id: 1 }, quantity: 2 }],
    });
    expect(res).toEqual(data);
  });

  it("fetches cart", async () => {
    const data = { items: [{ id: 1 }] };
    api.get.mockResolvedValue({ data });
    const res = await purchaseService.fetchCart();
    expect(api.get).toHaveBeenCalledWith("/cart");
    expect(res).toEqual(data);
  });

  it("clears cart", async () => {
    const data = {};
    api.delete.mockResolvedValue({ data });
    const res = await purchaseService.clearCart();
    expect(api.delete).toHaveBeenCalledWith("/cart");
    expect(res).toEqual(data);
  });

  it("creates purchase", async () => {
    const data = { id: 2 };
    api.post.mockResolvedValue({ data });
    const res = await purchaseService.createPurchase({ cartId: 2 });
    expect(api.post).toHaveBeenCalledWith("/purchase", { cartId: 2 });
    expect(res).toEqual(data);
  });

  it("confirms purchase", async () => {
    const data = { id: 3 };
    api.post.mockResolvedValue({ data });

    const res = await purchaseService.confirmPurchase(3);

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith("/purchase/3/confirm");
    expect(res).toEqual(data);
  });

  it("cancels purchase", async () => {
    const data = { success: true };
    api.delete.mockResolvedValue({ data });

    const res = await purchaseService.cancelPurchase(4);

    expect(api.delete).toHaveBeenCalledTimes(1);
    expect(api.delete).toHaveBeenCalledWith("/purchase/4");
    expect(res).toEqual(data);
  });
});
