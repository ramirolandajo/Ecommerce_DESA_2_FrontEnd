// src/Components/GlassProductCard.jsx
// Card clickeable en estilo claro, sin blur ni glass, textos más oscuros.
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { addFavourite, removeFavourite } from "../store/favourites/favouritesSlice.js";
import { productUrl } from "../routes/paths"; // ajustá el path si tu estructura difiere

export default function GlassProductCard({ item }) {
    const {
        id,
        brand = {},
        title,
        description,
        price,
        priceUnit,
        discount,
        currency = "ARS",
        cta = { href: "#" },
        mediaSrc = [],
        stock = 0,
    } = item || {};

    const money = (n, curr = currency) =>
        new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: curr,
            maximumFractionDigits: 0,
        }).format(n);

    const hasDiscount = typeof discount === "number" && discount > 0;
    // normalizamos el descuento: puede venir como 5 (5%) o 0.05 (5%)
    const discountNormalized =
        typeof discount === "number"
            ? discount > 0 && discount < 1
                ? discount * 100
                : discount
            : 0;
    const finalPrice =
        typeof price === "number"
            ? price
            : typeof priceUnit === "number"
            ? priceUnit * (1 - (hasDiscount ? discountNormalized : 0) / 100)
            : undefined;

    // si hay id → detalle; si no, cae al cta.href por compatibilidad
    const to = id ? productUrl(id) : cta?.href || "#";
    const outOfStock = stock === 0;

    const dispatch = useDispatch();
    const isLoggedIn = useSelector((s) => s.user.isLoggedIn);
    const isFavourite = useSelector((s) =>
        s.favourites.items.some((p) => String(p.id) === String(id))
    );

    const toggleFavourite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoggedIn) {
            window.alert("Debes iniciar sesión para gestionar favoritos");
            return;
        }
        dispatch(isFavourite ? removeFavourite(item.productCode) : addFavourite(item.productCode));
    };

    return (
        <Link
            to={to}
            onClick={(e) => {
                if (outOfStock) e.preventDefault();
            }}
            tabIndex={outOfStock ? -1 : undefined}
            aria-disabled={outOfStock ? "true" : undefined}
            className={[
                "group relative block overflow-hidden rounded-2xl p-5 sm:p-6 h-full",
                "bg-white border border-zinc-200 shadow-md",
                "transition hover:-translate-y-[2px] hover:shadow-lg",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                "flex flex-col text-zinc-900",
                outOfStock ? "pointer-events-none opacity-60" : "",
            ].join(" ")}
            aria-label={title}
        >
            <button
                type="button"
                onClick={toggleFavourite}
                aria-label={isFavourite ? "Quitar de favoritos" : "Agregar a favoritos"}
                className="absolute top-2 right-2 z-10 rounded-full bg-white/80 p-1 text-zinc-700 hover:bg-white"
            >
                {isFavourite ? (
                    <HeartSolid className="h-5 w-5 text-red-500" />
                ) : (
                    <HeartIcon className="h-5 w-5" />
                )}
            </button>
            {outOfStock && (
                <span className="absolute top-2 left-2 rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                    Sin stock
                </span>
            )}
            {/* Top bar: marca + precio (+ descuento si aplica) */}
            <div className="flex flex-nowrap items-start justify-between gap-2 mb-3 min-h-[2rem]">
                {brand?.name && (
                    <span className="inline-flex items-center px-2 py-1 text-[11px] font-medium rounded-full bg-zinc-100 text-zinc-700 truncate max-w-[8rem]">
                        {brand.name}
                    </span>
                )}

                {typeof finalPrice !== "undefined" && (
                    <div className="flex flex-nowrap items-center justify-end gap-2 flex-shrink-0">
                        {hasDiscount && typeof priceUnit === "number" && (
                            <span className="text-xs text-zinc-500 line-through">
                                {money(priceUnit)}
                            </span>
                        )}
                        {hasDiscount && (
                            <span className="text-xs font-bold text-red-600">
                                -{Math.round(discountNormalized)}%
                            </span>
                        )}
                        <span className="inline-flex flex-shrink-0 whitespace-nowrap items-center rounded-full px-3 py-1 text-sm font-semibold bg-black text-white">
                            {money(finalPrice)}
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
            {(() => {
                const first = Array.isArray(mediaSrc) ? mediaSrc[0] : undefined;
                const src =
                    typeof first === "string"
                        ? first
                        : first?.src || first?.url || null;
                return (
                    src && (
                        <div className="mt-4 rounded-xl overflow-hidden ring-1 ring-zinc-200 bg-zinc-50">
                            <img
                                src={src}
                                alt={title}
                                className="w-full aspect-[4/3] object-cover transition duration-300 group-hover:scale-[1.02]"
                                loading="lazy"
                            />
                        </div>
                    )
                );
            })()}

            <div className="mt-auto" />
        </Link>
    );
}
