import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
  token: localStorage.getItem("token") || null, // 🔥 FIX 1: persist token
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload;

      // 🔥 FIX 2: keep token synced
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      }
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    // 🔥 FIX 3: IMPORTANT for address update flow
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("shippingAddress"); // 🔥 optional cleanup
    },
  },
});

export const {
  setUser,
  setToken,
  setLoading,
  setError,
  logout,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;