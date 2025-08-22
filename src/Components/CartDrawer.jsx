import React from "react";

export default function CartDrawer({ open, onClose = () => {} }) {
    return (
        <aside
            className={
                "fixed top-0 right-0 z-40 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 " +
                (open ? "translate-x-0" : "translate-x-full")
            }
        >
            <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">Carrito</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Cerrar"
                >
                    &times;
                </button>
            </div>
            <div className="p-4 text-sm text-gray-500">Carrito vacío</div>
        </aside>
    );
}
