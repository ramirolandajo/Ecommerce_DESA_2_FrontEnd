import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../store/cartSlice";
import { PATHS } from "../routes/paths.js";
import { tiles } from "../data/Products";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);

  const product = tiles.find((p) => p.id === id);

  if (!product) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-zinc-700">Producto no encontrado.</p>
        <Link to="/" className="text-indigo-600 underline">Volver</Link>
      </section>
    );
  }

  const { title, brand, description, price, oldPrice, currency = "USD", media } = product;
  const stock = product.stock ?? Infinity;
  const isQtyValid = qty >= 1 && qty <= stock;

  const money = (n, curr = currency) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: curr,
      maximumFractionDigits: 0,
    }).format(n);

  const hasDiscount = typeof oldPrice === "number" && oldPrice > price;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-6 text-zinc-600 hover:text-zinc-900">
        ← Volver
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <img
            src={media?.src}
            alt={media?.alt || title}
            className="w-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-zinc-900 whitespace-pre-line">{title}</h1>
          {brand && <p className="mt-1 text-zinc-600">{brand}</p>}

          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-bold text-zinc-900">{money(price)}</span>
            {hasDiscount && (
              <span className="text-lg text-zinc-400 line-through">{money(oldPrice)}</span>
            )}
          </div>

          {description && <p className="mt-4 text-zinc-700">{description}</p>}

          <div className="mt-6">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => {
                const value = Number(e.target.value);
                const clamped = Math.max(1, Math.min(stock, value));
                setQty(clamped);
              }}
              className="w-24 rounded-xl border border-zinc-300 px-3 py-2"
            />
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => {
                dispatch(addItem({ id, title, price, quantity: qty }));
                navigate(PATHS.cart);
              }}
              disabled={!isQtyValid || product.stock === 0}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agregar al carrito
            </button>

            <button
              onClick={() => {
                dispatch(addItem({ id, title, price, quantity: qty }));
                navigate(PATHS.checkout);
              }}
              className="rounded-xl border border-zinc-300 px-5 py-3 font-medium text-zinc-800 hover:border-zinc-400"
            >
              Comprar ahora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
