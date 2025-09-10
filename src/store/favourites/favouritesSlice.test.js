import { describe, it, expect } from "vitest";
import reducer, {
  fetchFavourites,
  addFavourite,
  removeFavourite,
} from "./favouritesSlice";

const initialState = { items: [], status: "idle", error: null };

describe("favouritesSlice", () => {
  it("returns the initial state", () => {
    const state = reducer(undefined, { type: "unknown" });
    expect(state).toEqual(initialState);
  });

  it("handles fetchFavourites.pending", () => {
    const state = reducer(initialState, fetchFavourites.pending());
    expect(state).toEqual({ items: [], status: "loading", error: null });
  });

  it("handles fetchFavourites.fulfilled", () => {
    const items = [{ id: 1 }, { id: 2 }];
    const state = reducer(initialState, fetchFavourites.fulfilled(items));
    expect(state).toEqual({ items, status: "succeeded", error: null });
  });

  it("handles fetchFavourites.rejected", () => {
    const action = { type: fetchFavourites.rejected.type, error: { message: "Error" } };
    const state = reducer(initialState, action);
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Error");
  });

  it("handles addFavourite.fulfilled", () => {
    const product = { id: 3 };
    const state = reducer({ ...initialState, items: [{ id: 1 }] }, addFavourite.fulfilled(product));
    expect(state.items).toEqual([{ id: 1 }, product]);
  });

  it("handles removeFavourite.fulfilled", () => {
    const state = reducer(
      { ...initialState, items: [{ id: 1 }, { id: 2 }] },
      removeFavourite.fulfilled(1),
    );
    expect(state.items).toEqual([{ id: 2 }]);
  });
});
