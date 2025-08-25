import { useRef, useMemo } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeItem,
  updateQuantity,
  clearCart,
  incrementItem,
  decrementItem,
} from "../store/cartSlice";
import { PATHS } from "../routes/paths.js";

export default function CartDrawer({ open, onClose }) {
  const { items = [], totalAmount = 0 } = useSelector((s) => s.cart ?? {});
  const dispatch = useDispatch();
  const closeButtonRef = useRef(null);

  const handleQtyChange = (id, qty) => {
    const quantity = Number(qty);
    if (Number.isFinite(quantity) && quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  // Evita NaN en los totales si faltan datos
  const safeTotal = useMemo(() => Number(totalAmount ?? 0), [totalAmount]);

  const panelClasses = `fixed right-0 top-0 z-40 h-full w-64 sm:w-80 bg-white p-4 border-l border-gray-200 transform transition-transform ${
    open ? "translate-x-0" : "translate-x-full"
  }`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      initialFocus={closeButtonRef}
      className="relative z-40"
    >
      {/* Backdrop accesible */}
      <DialogBackdrop
        className={`fixed inset-0 bg-black/30 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel deslizante a la derecha */}
      <DialogPanel className={panelClasses}>
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-lg">Cart</h2>
          <button
            ref={closeButtonRef}
            className="p-2 text-gray-700 hover:text-gray-900"
            aria-label="Cerrar carrito"
            onClick={onClose}
            type="button"
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <p>Carrito vacío</p>
        ) : (
          <div className="flex h-[calc(100%-40px)] flex-col overflow-hidden">
            <ul className="flex-1 overflow-y-auto divide-y">
              {items.map((item) => (
                <li
                  key={`${item.id}-${item.variant ?? ""}`}
                  className="py-2 flex items-center gap-3 justify-between"
                >
                  <img
                    src={item.image || "https://via.placeholder.com/48"}
                    alt={item.title}
                    className="h-12 w-12 object-cover rounded"
                  />

                  <span className="flex-1 text-sm line-clamp-2">
                    {item.title}
                  </span>

                  {/* Controles de cantidad */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="px-2 border rounded text-sm disabled:opacity-50"
                      aria-label={`Disminuir cantidad de ${item.title}`}
                      onClick={() => dispatch(decrementItem(item.id))}
                      disabled={(item.quantity ?? 1) <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity ?? 1}
                      onChange={(e) =>
                        handleQtyChange(item.id, e.target.value)
                      }
                      className="w-12 border rounded px-1 py-0.5 text-sm text-center"
                      aria-label={`Cantidad de ${item.title}`}
                    />
                    <button
                      type="button"
                      className="px-2 border rounded text-sm"
                      aria-label={`Aumentar cantidad de ${item.title}`}
                      onClick={() => dispatch(incrementItem(item.id))}
                    >
                      +
                    </button>
                  </div>

                  {/* Precios */}
                  <div className="text-xs text-right min-w-[72px]">
                    <span>
                      ${Number(item.price ?? 0).toFixed(2)}
                    </span>
                    <span className="block">
                      ${Number((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="text-red-600 text-xs"
                    onClick={() => dispatch(removeItem(item.id))}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>

            {/* Footer del drawer */}
            <div className="mt-4 border-t pt-2 text-sm shrink-0">
              <p className="flex justify-between">
                <span>Total:</span>
                <span>${safeTotal.toFixed(2)}</span>
              </p>

              <Link
                to={PATHS.checkout}
                onClick={onClose}
                className="mt-2 block w-full rounded bg-indigo-600 px-3 py-1 text-center text-white hover:bg-indigo-700"
              >
                Finalizar compra
              </Link>

              <button
                type="button"
                className="mt-2 w-full rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                onClick={() => dispatch(clearCart())}
              >
                Vaciar carrito
              </button>

              <Link
                to={PATHS.cart}
                onClick={onClose}
                className="mt-2 block w-full rounded bg-indigo-600 px-3 py-1 text-center text-white hover:bg-indigo-700"
              >
                Ver carrito
              </Link>
            </div>
          </div>
        )}
      </DialogPanel>
    </Dialog>
  );
}
