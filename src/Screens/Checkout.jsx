import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementItem,
  decrementItem,
  updateQuantity,
  removeItem,
} from "../store/cartSlice";
import { createPreference } from "../utils/mercadoPago.js";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function Checkout() {
  // Toma items del slice
  const { items = [] } = useSelector((s) => s.cart) ?? {};
  const dispatch = useDispatch();

  // Estados para códigos de descuento y tarjeta de bono
  const [discountCode, setDiscountCode] = useState("");
  const [bonusCard, setBonusCard] = useState("");

  // Subtotal calculado localmente
  const subtotal = items.reduce(
    (acc, i) => acc + (i.price ?? 0) * (i.quantity ?? 1),
    0
  );

  // Impuestos y envío estimados
  const taxRate = 0.05;
  const shipping = 10;
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shipping;

  const handleQtyChange = (id, raw) => {
    const n = Number(raw);
    if (!Number.isNaN(n) && n > 0) {
      dispatch(updateQuantity({ id, quantity: n }));
    }
  };

  const money = (n) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD", // si querés ARS cambiá a "ARS"
      maximumFractionDigits: 0,
    }).format(n ?? 0);

  const handleConfirm = async () => {
    new window.MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);
    const initPoint = await createPreference(items);
    window.location.href = initPoint;
  };

  if (!items.length) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
        <p className="text-zinc-600">No hay productos en el carrito.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna izquierda: carrito */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Shopping Cart</h2>
          <ul className="divide-y divide-zinc-200 rounded border">
            {items.map((item) => (
              <li
                key={`${item.id}-${item.variant ?? ""}`}
                className="flex items-center justify-between gap-2 p-4 text-sm"
              >
                <span className="flex-1 text-zinc-700">{item.title}</span>

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
                    onChange={(e) => handleQtyChange(item.id, e.target.value)}
                    className="w-12 border rounded px-1 py-0.5 text-center"
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

                <span className="w-20 text-right font-medium">
                  {money((item.price ?? 0) * (item.quantity ?? 1))}
                </span>

                <button
                  type="button"
                  className="p-1 text-zinc-400 hover:text-red-600"
                  aria-label={`Eliminar ${item.title}`}
                  onClick={() => dispatch(removeItem(item.id))}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna derecha: resumen de pedido */}
        <aside className="self-start">
          <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
          <div className="space-y-4 rounded border p-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Discount code / Promo code"
                  className="flex-1 rounded border px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  className="rounded border px-3 py-1 text-sm"
                >
                  Apply
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bonusCard}
                  onChange={(e) => setBonusCard(e.target.value)}
                  placeholder="Your bonus card number"
                  className="flex-1 rounded border px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  className="rounded border px-3 py-1 text-sm"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="space-y-1 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span>{money(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated shipping &amp; handling</span>
                <span>{money(shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 active:bg-indigo-800"
              onClick={handleConfirm}
            >
              Checkout
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
