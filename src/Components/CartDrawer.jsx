import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, clearCart } from "../store/cartSlice.js";

export default function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const money = (n) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-40 h-full w-64 bg-white p-4 border-l border-gray-200 transform transition-transform ${
open ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-lg">Cart</h2>
          <button
            className="p-2 text-gray-700 hover:text-gray-900"
            aria-label="Close cart"
            onClick={onClose}
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>
        {items.length === 0 ? (
          <p>Carrito vacío</p>
        ) : (
          <>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x {money(item.price)}
                    </p>
                  </div>
                  <button
                    className="text-sm text-red-500 hover:text-red-700"
                    onClick={() => dispatch(removeItem(item.id))}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
            <button
              className="mt-4 w-full rounded bg-gray-200 py-2 text-sm text-gray-700 hover:bg-gray-300"
              onClick={() => dispatch(clearCart())}
            >
              Vaciar carrito
            </button>
          </>
        )}
      </aside>
    </>
  );
}
