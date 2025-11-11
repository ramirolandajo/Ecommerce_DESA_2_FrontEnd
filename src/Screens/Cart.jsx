import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  removeItem,
  updateQuantity,
  incrementItem,
  decrementItem,
  clearCart,
} from "../store/cart/cartSlice";
import { createCart as purchaseCreateCart } from "../store/purchase/purchaseSlice";
import { PATHS } from "../routes/paths";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function Cart() {
  const { items = [] } = useSelector((s) => s.cart ?? {});
  const dispatch = useDispatch();

  const subtotal = useMemo(
    () =>
      items.reduce(
        (acc, i) => acc + Number(i.price ?? 0) * Number(i.quantity ?? 1),
        0,
      ),
    [items],
  );

  const money = (n) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(n) || 0);

  const handleQtyChange = (id, qty) => {
    const quantity = Number(qty);
    if (Number.isFinite(quantity) && quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const result = await dispatch(purchaseCreateCart()).unwrap();
      console.log(
        "Respuesta del backend al finalizar compra desde carrito:",
        result,
      );
      navigate(PATHS.checkout);
    } catch (err) {
      console.error("Error al crear el carrito:", err);
    }
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-lg border border-zinc-200 p-12 text-center shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Tu carrito está vacío
          </h2>
          <Link
            to={PATHS.shop}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50"
          >
            Seguir comprando
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          {items.map((item) => {
            const qty = Number(item.quantity ?? 1);
            const unit = Number(item.price ?? 0);
            const line = qty * unit;
            return (
              <div
                key={`${item.id}-${item.variant ?? ""}`}
                className="flex items-center gap-4 rounded-lg border border-zinc-200 p-4 shadow-sm"
              >
                <img
                  src={
                    item.image ||
                    "https://via.placeholder.com/150?text=No+Image"
                  }
                  alt={item.title}
                  className="h-20 w-20 rounded border border-zinc-200 object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-zinc-500">#{item.id}</p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      className="h-8 w-8 rounded border border-zinc-300 text-zinc-700 disabled:opacity-40"
                      onClick={() => dispatch(decrementItem(item.id))}
                      disabled={qty <= 1}
                    >
                      –
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => handleQtyChange(item.id, e.target.value)}
                      className="h-8 w-12 rounded border border-zinc-300 text-center text-sm"
                    />
                    <button
                      type="button"
                      className="h-8 w-8 rounded border border-zinc-300 text-zinc-700"
                      onClick={() => dispatch(incrementItem(item.id))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-zinc-900">{money(line)}</p>
                  <p className="text-[11px] text-zinc-500">{money(unit)} c/u</p>
                </div>

                <button
                  type="button"
                  className="ml-2 rounded p-1 text-zinc-400 hover:text-red-600"
                  onClick={() => dispatch(removeItem(item.id))}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="h-fit space-y-4 rounded-lg border border-zinc-200 p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-700">Subtotal</span>
            <span className="font-semibold text-zinc-900">
              {money(subtotal)}
            </span>
          </div>

          <button
            type="button"
            data-testid="checkout-button"
            className="block w-full rounded-lg bg-black py-3 text-center font-medium text-white hover:bg-zinc-800"
            onClick={handleCheckout}
          >
            Finalizar compra
          </button>

          <button
            type="button"
            className="w-full rounded-lg border border-red-200 py-3 text-sm text-red-600 hover:bg-red-50"
            onClick={() => dispatch(clearCart())}
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </section>
  );
}
