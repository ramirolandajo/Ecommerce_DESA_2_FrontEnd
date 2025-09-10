import React, { Suspense } from "react";
import ScrollToTop from "./routes/ScrollToTop";
import AppRoutes from "./routes/Routes.jsx"; // opcional
import Loader from "./Components/Loader.jsx";
import useInitProducts from "./hooks/useInitProducts.js";

export default function App() {
    useInitProducts();
    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<Loader />}>
                <AppRoutes />
            </Suspense>
        </>
    );
}
