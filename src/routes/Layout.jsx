import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
