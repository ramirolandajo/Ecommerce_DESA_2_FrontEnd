// src/Components/GlassProductCard.jsx
// Card clickeable en estilo claro, sin blur ni glass, textos más oscuros.
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { addFavourite, removeFavourite } from "../store/favourites/favouritesSlice.js";
import { showNotification } from "../store/notification/notificationSlice.js";
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
    // Normalizamos el código del producto para comparar consistentemente
    const code = item?.productCode ?? id;
    const isFavourite = useSelector((s) =>
        s.favourites.items.some((p) => String(p.productCode ?? p.id) === String(code))
    );

    // Animación local del corazón: 'pop' al agregar, 'burst' al quitar
    const [anim, setAnim] = useState(null);
    const [particles, setParticles] = useState([]);
    const timerRef = useRef(null);
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const toggleFavourite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoggedIn) {
            dispatch(showNotification({ message: "Debes iniciar sesión para gestionar favoritos", type: "warning" }));
            return;
        }
        // Usamos el código normalizado (productCode si existe, si no fallback a id)
        dispatch(isFavourite ? removeFavourite(code) : addFavourite(code));
        // Trigger visual (arreglado y simplificado)
        if (timerRef.current) clearTimeout(timerRef.current);
        const rand = (min, max) => Math.random() * (max - min) + min;
        if (isFavourite) {
            // quitar favorito -> explosion muy simple y visible
            const count = 3;
            const parts = Array.from({ length: count }).map(() => {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 6 + 4; // 4-10px max
                const tx = Math.round(Math.cos(angle) * radius);
                const ty = Math.round(Math.sin(angle) * radius);
                const size = Math.round(rand(8, 14)); // más pequeño y discreto
                const dur = Math.round(rand(280, 420));
                const delay = Math.round(rand(0, 30));
                const s0 = 1; // sin escalado inicial
                const s1 = rand(1.03, 1.08); // muy leve escala
                const b0 = 0; // sin blur
                const b1 = 0; // sin blur final
                const o0 = 1; // totalmente opaco
                return { tx, ty, size, dur, delay, s0, s1, b0, b1, o0 };
            });
            // añadimos flag animate:false inicialmente y luego lo activamos en el siguiente tick
            const partsWithState = parts.map((p, i) => ({ id: i + Date.now(), ...p, animate: false }));
            setParticles(partsWithState);
            setAnim("burst");
            // activar animación en el próximo frame para que las transiciones corran
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setParticles((prev) => prev.map((x) => ({ ...x, animate: true })));
                });
            });
            timerRef.current = setTimeout(() => {
                setAnim(null);
                setParticles([]);
            }, 700);
        } else {
            // agregar favorito -> pop (sin partículas)
            setParticles([]);
            setAnim("pop");
            timerRef.current = setTimeout(() => setAnim(null), 420);
        }
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
                // Elevación y micro-interacciones más suaves
                "bg-white border border-zinc-200 shadow-sm",
                "transition transform duration-200 hover:-translate-y-2 hover:shadow-2xl",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                "flex flex-col text-zinc-900",
                outOfStock ? "opacity-60" : "",
            ].join(" ")}
            aria-label={title}
        >
            {/* Top bar: precio (+ descuento si aplica) */}
            <div className="flex flex-nowrap items-start justify-between gap-2 mb-3 min-h-[2rem]">
                {typeof finalPrice !== "undefined" && (
                    <div className="flex flex-nowrap items-center justify-start gap-2 flex-shrink-0">
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
                        <span className="inline-flex flex-shrink-0 whitespace-nowrap items-center rounded-full px-3 py-1 text-sm font-semibold bg-black text-white ring-1 ring-black/5">
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
                        <div className="mt-4 rounded-xl overflow-hidden ring-1 ring-zinc-200 bg-gradient-to-br from-white to-zinc-50 relative">
                            <div className="w-full aspect-[4/3] flex items-center justify-center bg-zinc-50">
                                <img
                                    src={src}
                                    alt={title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    )
                );
            })()}

            {/* Corazón para favoritos */}
            <button
                type="button"
                onClick={toggleFavourite}
                aria-label={isFavourite ? "Quitar de favoritos" : "Agregar a favoritos"}
                aria-pressed={isFavourite}
                title={isFavourite ? "Quitar de favoritos" : "Agregar a favoritos"}
                className={[
                    "absolute top-3 right-3 z-10 rounded-full bg-white p-2 text-zinc-700 shadow hover:bg-white/90 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 pointer-events-auto",
                    "button-heart-hover",
                    anim === 'pop' ? 'heart-pop' : '',
                    anim === 'burst' ? 'heart-burst' : '',
                ].join(' ')}
            >
                {/* ring/particles for burst (render dinámico y aleatorio) */}
                {anim === 'burst' && (
                  <span className="burst-ring" aria-hidden="true">
                    {particles.map((p) => {
                      const initialStyle = {
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        transform: `translate(-50%, -50%) scale(${p.s0})`,
                        left: '50%',
                        top: '50%',
                        opacity: 1,
                        background: 'rgba(239,68,68,1)',
                        borderRadius: '50%',
                        boxShadow: '0 6px 12px rgba(239,68,68,0.18)',
                      };
                      const targetTransform = `translate(calc(-50% + ${p.tx}px), calc(-50% + ${p.ty}px)) scale(${p.s1})`;
                      const transition = `transform ${p.dur}ms cubic-bezier(.16,.84,.44,1) ${p.delay}ms, opacity ${p.dur}ms linear ${p.delay}ms`;
                      const style = p.animate ? {
                        ...initialStyle,
                        transform: targetTransform,
                        opacity: 0,
                        transition,
                      } : {
                        ...initialStyle,
                        transition,
                      };
                      return <span key={p.id} className="burst-particle" style={style} />;
                    })}
                  </span>
                )}
                {isFavourite ? (
                    <HeartSolid className="h-5 w-5 text-red-500 heart-icon" />
                ) : (
                    <HeartIcon className="h-5 w-5 heart-icon" />
                )}
            </button>

            {/* Etiqueta sin stock */}
            {outOfStock && (
                <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-gray-800 text-white">
                        Sin stock
                    </span>
                </div>
            )}

            {/* Marca */}
            {brand?.name && (
                <div className="absolute bottom-4 left-4 z-10">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-zinc-100 text-zinc-700 truncate max-w-[10rem]">
                        {brand.name}
                    </span>
                </div>
            )}
        </Link>
    );
}
