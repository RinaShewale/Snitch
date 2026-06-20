import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sellerProducts: [],
  allProducts: [],
  currentProduct: null,

  // 🔥 SEARCH
  searchProducts: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSellerProduct: (state, action) => {
      state.sellerProducts = action.payload;
    },

    setAllProducts: (state, action) => {
      state.allProducts = action.payload;
    },

    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },

    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },

    // 🔥 SEARCH
    setSearchProducts: (state, action) => {
      state.searchProducts = action.payload;
    },

    clearSearchProducts: (state) => {
      state.searchProducts = [];
    },
  },
});

export const {
  setSellerProduct,
  setAllProducts,
  setCurrentProduct,
  clearCurrentProduct,
  setSearchProducts,
  clearSearchProducts,
} = productSlice.actions;

export default productSlice.reducer;