// productsSlice.test.js
import { describe, it, expect } from "vitest";
import reducer, {
  fetchProducts,
  fetchProduct,
  selectProductById,
} from "./productsSlice";

const initialState = { items: [], current: null, related: [], status: "idle", error: null };

describe("productsSlice", () => {
  it("should return the initial state", () => {
    const state = reducer(undefined, { type: "unknown" });
    expect(state).toEqual(initialState);
  });

  // -------- fetchProducts ----------
  it("should handle fetchProducts.pending", () => {
    const state = reducer(initialState, fetchProducts.pending());
    expect(state.status).toBe("loading");
    expect(state.error).toBeNull();
  });

  it("should handle fetchProducts.fulfilled", () => {
    const items = [
      {
        id: 1,
        title: "A",
        mediaSrc: ["a.jpg"],
        brand: { id: 1, name: "BrandA" },
        priceUnit: 100,
        discount: 10,
        categories: [{ id: 10, name: "Cat" }],
        category: { id: 10, name: "Cat" },
      },
      {
        id: 2,
        title: "B",
        mediaSrc: ["b.jpg"],
        brand: { id: 2, name: "BrandB" },
        priceUnit: 200,
        discount: 0,
        categories: [{ id: 20, name: "Dog" }],
        category: { id: 20, name: "Dog" },
      },
    ];
    const state = reducer(initialState, fetchProducts.fulfilled(items));
    expect(state.status).toBe("succeeded");
    expect(state.items).toEqual(items);
    expect(state.error).toBeNull();
  });

  it("should handle fetchProducts.rejected", () => {
    const action = {
      type: fetchProducts.rejected.type,
      error: { message: "Network down" },
    };
    const state = reducer(initialState, action);
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Network down");
  });

  // -------- fetchProduct -----------
  it("should handle fetchProduct.pending", () => {
    const state = reducer(initialState, fetchProduct.pending());
    expect(state.status).toBe("loading");
    expect(state.error).toBeNull();
    // opcional: el slice hace current=null en pending
    // expect(state.current).toBeNull();
  });

  it("should handle fetchProduct.fulfilled", () => {
    const product = {
      id: 7,
      title: "Test",
      mediaSrc: ["p.jpg"],
      brand: { id: 3, name: "BrandP" },
      priceUnit: 300,
      discount: 5,
      categories: [{ id: 30, name: "Phones" }],
      category: { id: 30, name: "Phones" },
    };
    const relatedProducts = [
      {
        id: 8,
        title: "Rel1",
        mediaSrc: ["r1.jpg"],
        brand: { id: 4, name: "BrandR1" },
        priceUnit: 150,
        discount: 0,
        categories: [{ id: 30, name: "Phones" }],
        category: { id: 30, name: "Phones" },
      },
    ];
    const payload = { product, relatedProducts };
    const state = reducer(initialState, fetchProduct.fulfilled(payload));
    expect(state.status).toBe("succeeded");
    expect(state.current).toEqual(product);
    expect(state.related).toEqual(relatedProducts);
    expect(state.error).toBeNull();
  });

  it("should handle fetchProduct.rejected", () => {
    const action = {
      type: fetchProduct.rejected.type,
      error: { message: "Not found" },
    };
    const state = reducer(initialState, action);
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Not found");
  });

  it("selectProductById should return matching product", () => {
    const items = [
      {
        id: 1,
        title: "A",
        mediaSrc: ["a.jpg"],
        brand: { id: 1, name: "BrandA" },
        priceUnit: 100,
        discount: 10,
        categories: [{ id: 10, name: "Cat" }],
        category: { id: 10, name: "Cat" },
      },
      {
        id: 2,
        title: "B",
        mediaSrc: ["b.jpg"],
        brand: { id: 2, name: "BrandB" },
        priceUnit: 200,
        discount: 0,
        categories: [{ id: 20, name: "Dog" }],
        category: { id: 20, name: "Dog" },
      },
    ];
    const state = { products: { ...initialState, items } };
    const select = selectProductById(2);
    expect(select(state)).toEqual(items[1]);
  });
});
