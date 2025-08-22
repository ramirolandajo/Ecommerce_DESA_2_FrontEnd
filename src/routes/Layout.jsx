import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import CartDrawer from "../Components/CartDrawer.jsx";

export default function Layout() {
    const [cartOpen, setCartOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar onCartToggle={() => setCartOpen((o) => !o)} />
            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
