import { Suspense } from "react";
import ScrollToTop from "./routes/ScrollToTop";
import AppRoutes from "./routes/Routes.jsx"; // opcional

export default function App() {
    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<div className="p-6 text-zinc-600">Cargando…</div>}>
                <AppRoutes />
            </Suspense>
        </>
    );
}
