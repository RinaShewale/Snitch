import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../Features/auth/redux/auth.slice";
import productReducer from "../Features/products/redux/product.slice";
import cartReducer from "../Features/products/cart/redux/cart.slice";
import orderReducer from "../Features/products/order/redux/order.slice";
import wishlistReducer from "../Features/products/wishlist/redux/wishlist.slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    orders: orderReducer,
     wishlist: wishlistReducer,
  },
});