import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import {
  removeItem,
  updateQuantity,
  clearCart,
  incrementItem,
  decrementItem,
} from "../store/cartSlice";

export default function CartDrawer({ open, onClose }) {
  const { items, totalAmount } = useSelector((s) => s.cart);
  const dispatch = useDispatch();

  const handleQtyChange = (id, qty) => {
    const quantity = Number(qty);
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-40 h-full w-64 bg-white p-4 border-l border-gray-200 transform transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
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
          <div className="flex flex-col h-full">
            <ul className="flex-1 overflow-auto divide-y">
              {items.map((item) => (
                <li key={item.id} className="py-2 flex items-center justify-between gap-2">
                  <span className="flex-1 text-sm">{item.title}</span>
                  <div className="flex items-center gap-1">
                    <button
                      className="px-2 border rounded text-sm"
                      aria-label="Decrease quantity"
                      onClick={() => dispatch(decrementItem(item.id))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleQtyChange(item.id, e.target.value)}
                      className="w-12 border rounded px-1 py-0.5 text-sm text-center"
                    />
                    <button
                      className="px-2 border rounded text-sm"
                      aria-label="Increase quantity"
                      onClick={() => dispatch(incrementItem(item.id))}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="text-red-600 text-xs"
                    onClick={() => dispatch(removeItem(item.id))}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t pt-2 text-sm">
              <p className="flex justify-between">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </p>
              <button
                className="mt-2 w-full rounded bg-gray-200 px-3 py-1 text-sm"
                onClick={() => dispatch(clearCart())}
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
