import React from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/admin/dashboard";
import Categories from "./pages/admin/categories";
import NewCategory from "./pages/admin/categories/NewCategory";
import Products from "./pages/admin/products";
import NewProduct from "./pages/admin/products/ProductForm";
import Register from "./pages/admin/dashboard/Register";
import StorefrontHome from "./pages/storefront/Home";
import CategoryListing from "./pages/storefront/CategoryListing";
import ProductDetail from "./pages/storefront/ProductDetail";
import ProductSearch from "./pages/storefront/Search";
import {
  getTokenPayload,
  isAuthenticated,
  decodeTokenPayload,
} from "./utils/auth";

function ProtectedRoute() {
  const tokenDetails = getTokenPayload();

  if (isAuthenticated) {
    if (
      tokenDetails?.role === "admin" &&
      window.location.pathname.startsWith("/admin")
    ) {
      return <Outlet />;
    } else if (
      tokenDetails?.role === "user" &&
      !window.location.pathname.startsWith("/admin")
    ) {
      return <Outlet />;
    } else if (
      tokenDetails?.role === "admin" &&
      !window.location.pathname.startsWith("/admin")
    ) {
      return <Navigate to="/admin" replace />;
    } else if (
      tokenDetails?.role === "user" &&
      window.location.pathname.startsWith("/admin")
    ) {
      return <Navigate to="/" replace />;
    }
  } else {
    return <Navigate to="/login" replace />;
  }
}

const router = createBrowserRouter([
  {
    path: "/admin",
    children: [
      { path: "register", element: <Register from="admin" /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          { path: "dashboard", Component: Dashboard },
          { path: "categories", Component: Categories },
          { path: "categories/new", Component: NewCategory },
          { path: "categories/:categoryId/edit", Component: NewCategory },
          { path: "products", Component: Products },
          { path: "products/new", Component: NewProduct },
          { path: "products/:productId/edit", Component: NewProduct },
        ],
      },
    ],
  },
  {
    path: "/register",
    element: <Register from="user" />,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      { index: true, Component: StorefrontHome },
      { path: "search", Component: ProductSearch },
      { path: "categories/:categorySlug", Component: CategoryListing },
      { path: "products/:productId", Component: ProductDetail },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
