import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../store/cartSlice";
import { PATHS } from "../routes/paths.js";
import { tiles } from "../data/Products";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = tiles.find((p) => p.id === id);

  if (!product) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-zinc-700">Producto no encontrado.</p>
        <Link to="/" className="text-indigo-600 underline">Volver</Link>
      </section>
    );
  }

  const { title, brand, description, price, oldPrice, currency = "USD", media, stock = 0 } = product;

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
          <p className="mt-2 text-sm">
            {stock > 0 ? (
              <>Stock: {stock}</>
            ) : (
              <span className="text-red-600">Sin stock</span>
            )}
          </p>

          {description && <p className="mt-4 text-zinc-700">{description}</p>}

          <div className="mt-8 flex gap-3">
            <button
              disabled={stock === 0}
              onClick={() => {
                if (stock === 0) return;
                dispatch(addItem({ id, title, price }));
                navigate(PATHS.cart);
              }}
              className={[
                "rounded-xl px-5 py-3 font-medium",
                stock === 0
                  ? "bg-gray-300 text-white cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700",
              ].join(" ")}
            >
              {stock === 0 ? "Sin stock" : "Agregar al carrito"}
            </button>

            <button
              disabled={stock === 0}
              onClick={() => {
                if (stock === 0) return;
                dispatch(addItem({ id, title, price }));
                navigate(PATHS.checkout);
              }}
              className={[
                "rounded-xl border px-5 py-3 font-medium",
                stock === 0
                  ? "border-zinc-200 text-zinc-400 cursor-not-allowed"
                  : "border-zinc-300 text-zinc-800 hover:border-zinc-400",
              ].join(" ")}
            >
              Comprar ahora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
