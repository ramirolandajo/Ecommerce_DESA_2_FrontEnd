import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,   // Aquí guardaremos info del usuario logueado
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userInfo = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.userInfo = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
