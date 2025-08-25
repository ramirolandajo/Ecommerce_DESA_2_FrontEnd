import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { addItem } from "../store/cartSlice";
import { PATHS } from "../routes/paths.js";
import { tiles } from "../data/Products";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
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

  const money = (n, curr = currency) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: curr,
      maximumFractionDigits: 0,
    }).format(n);

  const hasDiscount = typeof oldPrice === "number" && oldPrice > price;

  const handleAdd = () => {
    dispatch(addItem({ id, title, price, quantity }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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

          <div className="mt-8 flex items-center gap-3">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 rounded-xl border border-zinc-300 px-3 py-2 text-center"
            />
            <button
              onClick={handleAdd}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-white font-medium hover:bg-indigo-700"
            >
              Agregar al carrito
            </button>

            <button
              onClick={() => {
                dispatch(addItem({ id, title, price, quantity }));
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
