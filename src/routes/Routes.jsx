import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import Layout from "./Layout";
import RequireAuth from "./RequireAuth.jsx";
import ProductsScreen from "../Screens/ProductsScreen.jsx";
import ProductList from "../Components/Abm/ProductList.jsx";
import ProductForm from "../Components/Abm/ProductForm.jsx";
import ProductFilters from "../Components/Abm/ProductFilters.jsx";

// Ajustá estos paths/casing según tu estructura real de carpetas:
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
      path: '/abm', element: <ProductsScreen />,
      children: [
        { path: 'list', element: <ProductList products={[]} onEdit={() => {}} onDelete={() => {}} onAdjustStock={() => {}} /> },
        { path: 'create', element: <ProductForm onSave={() => {}} editingProduct={null} onCancel={() => {}} /> },
        { path: 'edit/:id', element: <ProductForm onSave={() => {}} editingProduct={null} onCancel={() => {}} /> },
        { path: 'filters', element: <ProductFilters /> },
      ]
    },
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
        { path: "*", element: <NotFound /> },

      ],
    },
  ]);
}
