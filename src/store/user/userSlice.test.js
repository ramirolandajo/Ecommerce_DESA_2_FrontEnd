import { describe, it, expect, beforeEach, vi } from "vitest";
import reducer, { login, register, verifyEmail, logout, checkAuth } from "./userSlice";

const initialState = { userInfo: null, token: null, isLoggedIn: false };

describe("userSlice", () => {
  beforeEach(() => {
    global.localStorage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
    };
  });

  it("should return the initial state", () => {
    const state = reducer(undefined, { type: "unknown" });
    expect(state).toEqual(initialState);
  });

  it("should handle login.fulfilled", () => {
    const payload = { user: { id: 1 }, token: "tok" };
    const state = reducer(initialState, login.fulfilled(payload));
    expect(state).toEqual({ userInfo: { id: 1 }, token: "tok", isLoggedIn: true });
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "tok");
  });

  it("should keep user logged out after register.fulfilled", () => {
    const payload = { message: "ok" };
    const state = reducer(initialState, register.fulfilled(payload));
    expect(state).toEqual(initialState);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("should handle verifyEmail.fulfilled", () => {
    const payload = { user: { id: 3 }, token: "tok3" };
    const state = reducer(initialState, verifyEmail.fulfilled(payload));
    expect(state).toEqual({ userInfo: { id: 3 }, token: "tok3", isLoggedIn: true });
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "tok3");
  });

  it("should handle logout.fulfilled", () => {
    const stateWithUser = { userInfo: { id: 1 }, token: "tok", isLoggedIn: true };
    const state = reducer(stateWithUser, logout.fulfilled());
    expect(state).toEqual(initialState);
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
  });

  it("should handle logout.rejected", () => {
    const stateWithUser = { userInfo: { id: 1 }, token: "tok", isLoggedIn: true };
    const state = reducer(stateWithUser, logout.rejected());
    expect(state).toEqual(initialState);
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
  });

  it("should handle checkAuth.fulfilled", () => {
    const payload = { user: { id: 5 }, token: "tok5" };
    const state = reducer(initialState, checkAuth.fulfilled(payload));
    expect(state).toEqual({ userInfo: { id: 5 }, token: "tok5", isLoggedIn: true });
  });

  it("should handle checkAuth.rejected", () => {
    const stateWithToken = { userInfo: null, token: "tok", isLoggedIn: true };
    const state = reducer(stateWithToken, checkAuth.rejected());
    expect(state).toEqual(initialState);
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
  });
});

