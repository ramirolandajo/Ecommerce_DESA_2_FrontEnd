// src/pages/Checkout.jsx
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementItem,
  decrementItem,
  updateQuantity,
  removeItem,
} from "../store/cartSlice";
import { createPreference } from "../utils/mercadoPago.js";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { tiles } from "../data/Products.js";

export default function Checkout() {
  const { items = [] } = useSelector((s) => s.cart) ?? {};
  const dispatch = useDispatch();

  // index rápido por id para traer media/título/brand
  const productIndex = useMemo(() => {
    const map = new Map();
    tiles.forEach((t) => map.set(t.id, t));
    return map;
  }, []);

  const [discountCode, setDiscountCode] = useState("");
  const [bonusCard, setBonusCard] = useState("");

  const subtotal = items.reduce(
      (acc, i) => acc + (i.price ?? 0) * (i.quantity ?? 1),
      0
  );

  // Para parecerse a la imagen: números fijos de “Estimated …”
  const tax = 50;
  const shipping = 29;
  const total = subtotal + tax + shipping;

  const money = (n) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(n ?? 0);

  const handleQtyChange = (id, raw) => {
    const n = Number(raw);
    if (!Number.isNaN(n) && n > 0) dispatch(updateQuantity({ id, quantity: n }));
  };

  const handleConfirm = async () => {
    new window.MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);
    const initPoint = await createPreference(items);
    window.location.href = initPoint;
  };

  if (!items.length) {
    return (
        <section className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="mb-4 text-3xl font-bold">Checkout</h1>
          <p className="text-zinc-600">No hay productos en el carrito.</p>
        </section>
    );
  }

  return (
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* IZQUIERDA: lista de productos */}
          <div>
            <h2 className="mb-6 text-lg font-semibold">Shopping Cart</h2>

            <ul className="space-y-6">
              {items.map((item) => {
                const p = productIndex.get(item.id);
                const img = item.image ?? p?.media?.src;
                const alt = p?.media?.alt ?? item.title;
                const title = p?.title ?? item.title;
                const brand = p?.brand;

                return (
                    <li
                        key={`${item.id}-${item.variant ?? ""}`}
                        className="flex items-center gap-4"
                    >
                      {img ? (
                          <img
                              src={img}
                              alt={alt}
                              className="h-16 w-16 rounded object-cover border border-zinc-200"
                          />
                      ) : (
                          <div className="h-16 w-16 rounded bg-zinc-100" />
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-zinc-900">
                          {brand ? `${brand} ` : ""}
                          {title?.replace(/\n/g, " ")}
                        </p>
                        <p className="text-xs text-zinc-500">#{item.id}</p>

                        <div className="mt-3 inline-flex items-center gap-2">
                          <button
                              type="button"
                              className="h-8 w-8 rounded border text-zinc-700 disabled:opacity-40"
                              onClick={() => dispatch(decrementItem(item.id))}
                              disabled={(item.quantity ?? 1) <= 1}
                              aria-label="Disminuir"
                          >
                            –
                          </button>
                          <input
                              type="number"
                              min={1}
                              value={item.quantity ?? 1}
                              onChange={(e) => handleQtyChange(item.id, e.target.value)}
                              className="h-8 w-12 rounded border text-center"
                              aria-label="Cantidad"
                          />
                          <button
                              type="button"
                              className="h-8 w-8 rounded border text-zinc-700"
                              onClick={() => dispatch(incrementItem(item.id))}
                              aria-label="Aumentar"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">{money(item.price)}</p>
                      </div>

                      <button
                          type="button"
                          className="ml-2 text-zinc-400 hover:text-red-500"
                          onClick={() => dispatch(removeItem(item.id))}
                          aria-label="Quitar"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </li>
                );
              })}
            </ul>
          </div>

          {/* DERECHA: resumen */}
          <aside>
            <h2 className="mb-6 text-lg font-semibold">Order Summary</h2>

            <div className="rounded-lg border border-zinc-200 p-6 space-y-6 shadow-sm bg-white">
              <div className="space-y-3">
                <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Discount code / Promo code"
                    className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <input
                      type="text"
                      value={bonusCard}
                      onChange={(e) => setBonusCard(e.target.value)}
                      placeholder="Your bonus card number"
                      className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm"
                  />
                  <button
                      type="button"
                      className="rounded border border-zinc-300 px-4 text-sm hover:bg-zinc-50"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-700">Subtotal</span>
                  <span className="text-zinc-900">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-700">Estimated Tax</span>
                  <span className="text-zinc-900">{money(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-700">Estimated shipping &amp; Handling</span>
                  <span className="text-zinc-900">{money(shipping)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t pt-4">
                  <span>Total</span>
                  <span>{money(total)}</span>
                </div>
              </div>

              <button
                  type="button"
                  className="w-full rounded bg-black py-3 text-white font-medium hover:bg-zinc-800"
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
