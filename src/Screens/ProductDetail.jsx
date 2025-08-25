import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { addItem } from "../store/cartSlice";
import { PATHS } from "../routes/paths.js";
import { tiles } from "../data/Products";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Estado local con validación
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

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

  // Stock: si no viene, lo tratamos como infinito (sin límite)
  const stock = Number.isFinite(product.stock) ? product.stock : Infinity;
  const isQtyValid = qty >= 1 && qty <= stock;

  const money = (n, curr = currency) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: curr,
      maximumFractionDigits: 0,
    }).format(n);

  const hasDiscount = typeof oldPrice === "number" && oldPrice > price;

  const handleAdd = () => {
    if (!isQtyValid || stock === 0) return;
    dispatch(addItem({ id, title, price, quantity: qty }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <Link
        to={PATHS.shop}
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
        className="mb-6 inline-flex items-center gap-1 rounded-md text-zinc-600 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
      >
        <ArrowLeftIcon className="size-5" aria-hidden="true" />
        <span>Volver</span>
      </Link>

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

          <p className="mt-2 text-sm">
            {stock === 0 ? (
              <span className="text-red-600">Sin stock</span>
            ) : Number.isFinite(stock) ? (
              <>Stock: {stock}</>
            ) : (
              <>Stock disponible</>
            )}
          </p>

          {description && <p className="mt-4 text-zinc-700">{description}</p>}

          <div className="mt-6">
            <label className="block text-sm text-zinc-600 mb-1">
              Cantidad {Number.isFinite(stock) && `(Stock: ${stock})`}
            </label>
            <input
              type="number"
              min={1}
              max={Number.isFinite(stock) ? stock : undefined}
              value={qty}
              onChange={(e) => {
                const val = Number(e.target.value);
                const clamped = Math.max(1, Math.min(stock, isNaN(val) ? 1 : val));
                setQty(clamped);
              }}
              className="w-24 rounded-xl border border-zinc-300 px-3 py-2 text-center"
            />
            {!isQtyValid && (
              <p className="mt-1 text-sm text-red-600">Cantidad inválida.</p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={handleAdd}
              disabled={!isQtyValid || stock === 0}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {stock === 0 ? "Sin stock" : "Agregar al carrito"}
            </button>

            <button
              onClick={() => {
                if (!isQtyValid || stock === 0) return;
                dispatch(addItem({ id, title, price, quantity: qty }));
                navigate(PATHS.checkout);
              }}
              className="rounded-xl border border-zinc-300 px-5 py-3 font-medium text-zinc-800 hover:border-zinc-400"
            >
              Comprar ahora
            </button>
          </div>

          {added && (
            <p className="mt-2 text-sm text-green-600">Producto añadido al carrito</p>
          )}
        </div>
      </div>
    </section>
  );
}
