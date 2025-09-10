import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  login as loginApi,
  register as registerApi,
  verifyEmail as verifyEmailApi,
  logout as logoutApi,
  fetchCurrentUser,
} from "../../api/auth";

// --- Thunks ---
export const login = createAsyncThunk("user/login", async (credentials) => {
  const { token, user } = await loginApi(credentials);
  return { token, user };
});

export const register = createAsyncThunk("user/register", async (data) => {
  const { message } = await registerApi(data);
  return { message };
});

export const verifyEmail = createAsyncThunk(
  "user/verifyEmail",
  async (data) => {
    const { token, user } = await verifyEmailApi(data);
    return { token, user };
  }
);

export const logout = createAsyncThunk("user/logout", async () => {
  await logoutApi();
});

export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, { rejectWithValue }) => {
    const token =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("token")
        : null;
    if (!token) {
      return rejectWithValue("No token");
    }
    try {
      const { user } = await fetchCurrentUser();
      return { user, token };
    } catch {
      return rejectWithValue("Invalid token");
    }
  }
);

// --- Estado ---
const token =
  typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
const initialState = {
  userInfo: null,
  token: token || null,
  isLoggedIn: !!token,
};

// --- Slice ---
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.userInfo = null;
        state.token = null;
        state.isLoggedIn = false;
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("token");
        }
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        if (action.payload.token && typeof localStorage !== "undefined") {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        if (action.payload.token && typeof localStorage !== "undefined") {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
        state.token = null;
        state.isLoggedIn = false;
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("token");
        }
      })
      .addCase(logout.rejected, (state) => {
        state.userInfo = null;
        state.token = null;
        state.isLoggedIn = false;
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("token");
        }
      });
  },
});

export default userSlice.reducer;

