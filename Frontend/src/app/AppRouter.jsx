import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Layout
import AppLayout from "../app/AppLayout";

// Auth Pages
import Login from "../Features/auth/pages/Login";
import Register from "../Features/auth/pages/Register";
import ForgotPassword from "../Features/auth/components/ForgotPassword";
import ResetPassword from "../Features/auth/components/ResetPassword";

// Home
import DashboardPage from "../Features/Home/Pages/DashboardPage";
import ShopPage from "../Features/Home/pages/ShopPage";
import CategoryPage from "../Features/Home/pages/CategoryPage";
import SearchPage from "../Features/Home/pages/SearchPage";
import CategoryGroupPage from "../Features/Home/pages/CategoryGroupPage";

// Cart / Checkout
import CartPage from "../Features/products/cart/pages/CartPage";

// 👉 ADD THIS (IMPORTANT)


// Wishlist
import WishlistPage from "../Features/products/wishlist/pages/WishlistPage";

// Orders
import MyOrders from "../Features/products/order/pages/MyOrders";
import OrderDetails from "../Features/products/order/pages/OrderDetails";

// Seller
import SellerInventory from "../Features/products/seller/pages/SellerInventory";
import SellerProductInsights from "../Features/products/seller/pages/SellerProductInsights";
import SellerListingForm from "../Features/products/seller/pages/SellerListingForm";
import SellerOrders from "../Features/products/seller/components/SellerOrders";

// Auth guard
import ProtectedRoute from "../Features/auth/components/ProtectedRoute";
import AddressPage from "../Features/auth/components/AddressPage";
import { ProductDetailPage } from "../Features/Home/pages/ProductDetailPage";
import OrderSuccessPage from "../Features/products/cart/pages/OrderSuccessPage";


// 🧠 SIMPLE GUARD (for address)
const requireAddress = (element) => {
  const address = localStorage.getItem("shippingAddress");

  if (!address) {
    return <Navigate to="/address" replace />;
  }

  return element;
};


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // ================= HOME =================
      { path: "/", element: <DashboardPage /> },
      { path: "/shop", element: <ShopPage /> },
      { path: "/product/:id", element: <ProductDetailPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/address", element: <AddressPage /> }, // ✅ IMPORTANT FIX

      { path: "/products/:category", element: <CategoryPage /> },
      { path: "/category/:group", element: <CategoryGroupPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/wishlist", element: <WishlistPage /> },

      // ================= ORDERS =================
      {
        path: "/my-orders",
        element: (
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders/:orderId",
        element: (
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        ),
      },

      {
        path: "/order-success",
        element: <OrderSuccessPage />,
      },

      // ================= SELLER =================
      {
        path: "/seller",
        children: [
          {
            path: "inventory",
            element: (
              <ProtectedRoute role="seller">
                <SellerInventory />
              </ProtectedRoute>
            ),
          },
          {
            path: "create",
            element: (
              <ProtectedRoute role="seller">
                <SellerListingForm />
              </ProtectedRoute>
            ),
          },
          {
            path: "insights/:id",
            element: (
              <ProtectedRoute role="seller">
                <SellerProductInsights />
              </ProtectedRoute>
            ),
          },
          {
            path: "orders",
            element: (
              <ProtectedRoute role="seller">
                <SellerOrders />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },

  // ================= AUTH =================
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;