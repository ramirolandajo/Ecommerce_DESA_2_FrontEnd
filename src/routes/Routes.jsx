import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import Layout from "./Layout";
import RequireAuth from "./RequireAuth.jsx";

const Home = lazy(() => import("../Screens/Home.jsx"));
const Shop = lazy(() => import("../Screens/Shop.jsx"));
const ProductDetail = lazy(() => import("../Screens/ProductDetail.jsx"));
const Cart = lazy(() => import("../Screens/Cart.jsx"));
const Checkout = lazy(() => import("../Screens/Checkout.jsx"));
const Purchase = lazy(() => import("../Screens/Purchase.jsx"));
const Favourites = lazy(() => import("../Screens/Favourites.jsx"));
const Login = lazy(() => import("../Screens/Login.jsx"));
const Register = lazy(() => import("../Screens/Register.jsx"));
const VerifyEmail = lazy(() => import("../Screens/VerifyEmail.jsx"));
const PurchaseDetail = lazy(() => import("../Screens/PurchaseDetail.jsx"));
const UserPurchases = lazy(() => import("../Screens/UserPurchases.jsx"));
const ReviewProduct = lazy(() => import("../Screens/ReviewProduct.jsx"));
const UserProfile = lazy(() => import("../Screens/UserProfile.jsx"));

const NotFound = () => (
  <div className="mx-auto max-w-3xl px-4 py-16">
    <h1 className="text-2xl font-bold">404</h1>
    <p className="text-zinc-600">Página no encontrada.</p>
  </div>
);

export default function AppRoutes() {
  return useRoutes([
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/verify-email", element: <VerifyEmail /> },
    {
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/shop", element: <Shop /> },
        { path: "/producto/:id", element: <ProductDetail /> },
        {
          path: "/favourites",
          element: (
            <RequireAuth>
              <Favourites />
            </RequireAuth>
          ),
        },
        {
          path: "/cart", element: (
            <RequireAuth>
              <Cart />
            </RequireAuth>
          )
        },
        {
          path: "/checkout", element: (
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          )
        },
        {
          path: "/purchase", element: (
            <RequireAuth>
              <Purchase />
            </RequireAuth>
          )
        },
        {
          path: "/purchase/:id", element: (
            <RequireAuth>
              <PurchaseDetail />
            </RequireAuth>
          )
        },
        {
          path: "/user-purchases", element: (
            <RequireAuth>
              <UserPurchases />
            </RequireAuth>
          )
        },
        {
          path: "/review/:productCode",
          element: (
            <RequireAuth>
              <ReviewProduct />
            </RequireAuth>
          ),
        },
        {
          path: "/user-profile",
          element: (
            <RequireAuth>
              <UserProfile />
            </RequireAuth>
          ),
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);
}
