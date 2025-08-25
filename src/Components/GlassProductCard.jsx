// src/Components/GlassProductCard.jsx
// Card clickeable en estilo claro, sin blur ni glass, textos más oscuros.
import { Link } from "react-router-dom";
import { productUrl } from "../routes/paths"; // ajustá el path si tu estructura difiere

export default function GlassProductCard({ item }) {
    const {
        id,
        brand,
        title,
        description,
        price,
        oldPrice,
        currency = "USD",
        cta = { href: "#" },
        media = {},
    } = item || {};

    const money = (n, curr = currency) =>
        new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: curr,
            maximumFractionDigits: 0,
        }).format(n);

    const hasDiscount =
        typeof oldPrice === "number" &&
        typeof price === "number" &&
        oldPrice > price;

    const percentOff = hasDiscount
        ? Math.round(((oldPrice - price) / oldPrice) * 100)
        : null;

    // si hay id → detalle; si no, cae al cta.href por compatibilidad
    const to = id ? productUrl(id) : (cta?.href || "#");

    return (
        <Link
            to={to}
            className={[
                "group relative block overflow-hidden rounded-2xl p-5 sm:p-6 h-full",
                "bg-white border border-zinc-200 shadow-md",
                "transition hover:-translate-y-[2px] hover:shadow-lg",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                "flex flex-col text-zinc-900",
            ].join(" ")}
            aria-label={title}
        >
            {/* Top bar: marca + precio (+ descuento si aplica) */}
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                {brand && (
                    <span className="inline-flex items-center px-2 py-1 text-[11px] font-medium rounded-full bg-zinc-100 text-zinc-700">
            {brand}
          </span>
                )}

                {typeof price !== "undefined" && (
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        {hasDiscount && (
                            <span className="text-xs text-zinc-500 line-through">
                {money(oldPrice)}
              </span>
                        )}
                        {hasDiscount && (
                            <span className="text-xs font-bold text-red-600">
                -{percentOff}%
              </span>
                        )}
                        <span className="inline-flex flex-shrink-0 whitespace-nowrap items-center rounded-full px-3 py-1 text-sm font-semibold bg-black text-white">
              {money(price)}
            </span>
                    </div>
                )}
            </div>

            {/* Título */}
            <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 leading-tight line-clamp-2 min-h-[3rem] whitespace-pre-line">
                {title}
            </h3>

            {/* Descripción */}
            {description && (
                <p className="mt-2 text-sm text-zinc-700 line-clamp-2 min-h-[2.5rem]">
                    {description}
                </p>
            )}

            {/* Imagen */}
            {media?.type === "image" && media?.src && (
                <div className="mt-4 rounded-xl overflow-hidden ring-1 ring-zinc-200 bg-zinc-50">
                    <img
                        src={media.src}
                        alt={media.alt ?? title}
                        className="w-full aspect-[4/3] object-cover transition duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                    />
                </div>
            )}

            <div className="mt-auto" />
        </Link>
    );
}
