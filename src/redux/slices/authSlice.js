import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  isAuthenticated: false,
  token: null,
};

const isValidateToken = (token) => {
  if (!token) return false;
  try {
    const decode = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decode.exp > currentTime;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("token");
      if (isValidateToken(token)) {
        state.token = token;
        state.isAuthenticated = true;
      } else {
        localStorage.removeItem("token");
        state.token = null;
        state.isAuthenticated = false;
      }
    },
    login: (state, action) => {
      localStorage.setItem("token", action.payload);
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});
export const { login, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
