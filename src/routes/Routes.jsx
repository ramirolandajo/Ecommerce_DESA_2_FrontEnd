import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import Layout from "./Layout";

// 👇 Importá según TU casing real de carpetas:
const Home = lazy(() => import("../Screens/Home.jsx"));
const Shop = lazy(() => import("../Screens/Shop.jsx"));
const ProductDetail = lazy(() => import("../Screens/ProductDetail.jsx")); // ← antes decía ../Screens/
const Checkout = lazy(() => import("../Screens/Checkout.jsx"));

const NotFound = () => (
    <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-bold">404</h1>
        <p className="text-zinc-600">Página no encontrada.</p>
    </div>
);

export default function AppRoutes() {
    return useRoutes([
        {
            element: <Layout />,
            children: [
                { path: "/", element: <Home /> },
                { path: "/shop", element: <Shop /> },
                { path: "/producto/:id", element: <ProductDetail /> },
                { path: "/checkout", element: <Checkout /> },
                { path: "*", element: <NotFound /> },
            ],
        },
    ]);
}
