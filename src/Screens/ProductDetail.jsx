import { useId, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    ShieldCheckIcon,
    TruckIcon,
    ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";
import { addItem } from "../store/cart/cartSlice.js";
import { PATHS } from "../routes/paths.js";
import { tiles } from "../data/Products";
import Breadcrumbs from "../Components/Breadcrumbs.jsx";
import RelatedProductsSection from "../Sections/RelatedProductsSection.jsx";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Estado UI
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const qtyId = useId();

    // Match robusto por si el id de tiles es number
    const product = tiles.find((p) => String(p.id) === String(id));

    if (!product) {
        return (
            <section className="mx-auto max-w-3xl px-4 py-12">
                <p className="text-zinc-700">Producto no encontrado.</p>
                <Link to="/" className="text-indigo-600 underline">
                    Volver
                </Link>
            </section>
        );
    }

    const {
        title,
        brand,
        description,
        price,
        oldPrice,
        currency = "USD",
        media,
        stock: rawStock,
        freeShipping, // opcional en tus tiles
        category,
        subcategory,
    } = product;

    const segments = useMemo(() => {
        const segs = [];
        if (category) {
            segs.push({
                label: category,
                to: `${PATHS.shop}?category=${encodeURIComponent(category)}`,
            });
            if (subcategory) {
                segs.push({
                    label: subcategory,
                    to: `${PATHS.shop}?category=${encodeURIComponent(
                        category
                    )}&subcategory=${encodeURIComponent(subcategory)}`,
                });
            }
        }
        segs.push({ label: title });
        return segs;
    }, [category, subcategory, title]);

    // Stock y validaciones
    const stock = Number.isFinite(rawStock) ? rawStock : Infinity;
    const outOfStock = stock === 0;
    const isFiniteStock = Number.isFinite(stock);
    const isQtyValid = qty >= 1 && qty <= stock;

    // Formateador monetario memoizado
    const formatter = useMemo(
        () =>
            new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency,
                maximumFractionDigits: 0,
            }),
        [currency]
    );
    const money = (n) => formatter.format(n);

    const hasDiscount =
        typeof oldPrice === "number" && typeof price === "number" && oldPrice > price;

    const { discountPercent, savings } = useMemo(() => {
        if (!hasDiscount) return { discountPercent: null, savings: null };
        const diff = oldPrice - price;
        const pct = Math.round((diff / oldPrice) * 100);
        return { discountPercent: pct, savings: diff };
    }, [hasDiscount, oldPrice, price]);

    // Galería
    const gallery = useMemo(() => {
        if (!media) return [];
        return Array.isArray(media) ? media : [media];
    }, [media]);

    const [activeIndex, setActiveIndex] = useState(0);
    const activeImage = gallery[activeIndex];

    // Helper de URL
    const getSrc = useCallback((m) => (typeof m === "string" ? m : m?.src || m?.url || ""), []);
    const activeSrc = getSrc(activeImage);

    // Zoom hover/touch
    const [isZoomed, setIsZoomed] = useState(false);
    const [bgPos, setBgPos] = useState("50% 50%");
    const [touching, setTouching] = useState(false);

    const updateBgPos = (clientX, clientY, target) => {
        const rect = target.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        setBgPos(`${Math.min(100, Math.max(0, x))}% ${Math.min(100, Math.max(0, y))}%`);
    };

    const handleMouseMove = (e) => updateBgPos(e.clientX, e.clientY, e.currentTarget);

    const handleTouchStart = (e) => {
        if (!activeSrc) return;
        setTouching(true);
        setIsZoomed(true);
        const t = e.touches[0];
        updateBgPos(t.clientX, t.clientY, e.currentTarget);
    };
    const handleTouchMove = (e) => {
        if (!touching) return;
        const t = e.touches[0];
        updateBgPos(t.clientX, t.clientY, e.currentTarget);
    };
    const handleTouchEnd = () => {
        setTouching(false);
        setTimeout(() => setIsZoomed(false), 80);
    };

    // Lightbox
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const openLightbox = () => setLightboxOpen(true);
    const closeLightbox = () => setLightboxOpen(false);
    const goPrev = (e) => {
        e?.stopPropagation?.();
        setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length);
    };
    const goNext = (e) => {
        e?.stopPropagation?.();
        setActiveIndex((i) => (i + 1) % gallery.length);
    };

    const clampQty = (n) => {
        if (Number.isNaN(n) || n < 1) return 1;
        if (isFiniteStock) return Math.min(Math.max(1, n), stock);
        return n;
    };

    const handleQtyChange = (next) => {
        setQty((prev) => clampQty(typeof next === "number" ? next : prev));
    };

    const handleAdd = () => {
        if (!isQtyValid || outOfStock) return;
        dispatch(addItem({ id: String(product.id), title, price, quantity: qty }));
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
    };

    return (
        <section className="mx-auto max-w-6xl px-4 pb-28 pt-6 lg:pt-10">
            {/* Volver */}
            <div className="mb-6">
                <Link
                    to={PATHS.shop}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(-1);
                    }}
                    className="inline-flex items-center gap-1 rounded-md text-zinc-600 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 focus:ring-offset-white"
                >
                    <ArrowLeftIcon className="size-4" />
                    <span>Volver</span>
                </Link>
            </div>

            {/* Layout principal */}
            <div className="mt-4 grid gap-10 lg:grid-cols-12">
                {/* Galería */}
                <div className="lg:col-span-7 xl:col-span-8 lg:sticky lg:top-24">
                    {gallery.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-[88px_1fr] items-start gap-4">
                            {/* Miniaturas */}
                            <div className="order-2 md:order-1">
                                {/* móvil */}
                                <div className="md:hidden mt-2 -mx-4 px-4 flex gap-2 overflow-x-auto snap-x snap-mandatory">
                                    {gallery.map((item, idx) => {
                                        const src = getSrc(item);
                                        const isActive = activeIndex === idx;
                                        return (
                                            <button
                                                key={src || idx}
                                                type="button"
                                                onClick={() => setActiveIndex(idx)}
                                                className={[
                                                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg snap-start transition-shadow",
                                                    isActive
                                                        ? "ring-2 ring-indigo-500"
                                                        : "ring-1 ring-zinc-200 hover:ring-zinc-300",
                                                    "bg-white"
                                                ].join(" ")}
                                                aria-label={`Ver imagen ${idx + 1}`}
                                            >
                                                {src ? (
                                                    <img
                                                        src={src}
                                                        alt={`Miniatura ${idx + 1}`}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-xs text-zinc-500">
                                                        Sin imagen
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* desktop */}
                                <div className="hidden md:flex max-h-[560px] w-[88px] flex-col gap-2 overflow-auto pr-1">
                                    {gallery.map((item, idx) => {
                                        const src = getSrc(item);
                                        const isActive = activeIndex === idx;
                                        return (
                                            <button
                                                key={src || idx}
                                                type="button"
                                                onClick={() => setActiveIndex(idx)}
                                                className={[
                                                    "group relative aspect-square overflow-hidden rounded-lg transition-shadow",
                                                    isActive
                                                        ? "ring-2 ring-indigo-500"
                                                        : "ring-1 ring-zinc-200 hover:ring-zinc-300",
                                                    "bg-white"
                                                ].join(" ")}
                                                aria-label={`Ver imagen ${idx + 1}`}
                                            >
                                                {src ? (
                                                    <img
                                                        src={src}
                                                        alt={`Miniatura ${idx + 1}`}
                                                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-xs text-zinc-500">
                                                        Sin imagen
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Imagen principal */}
                            <div className="order-1 md:order-2 relative">
                                <div
                                    role="img"
                                    aria-label={title || "Imagen del producto"}
                                    onClick={activeSrc ? openLightbox : undefined}
                                    className={[
                                        "w-full rounded-xl bg-white bg-no-repeat shadow-sm",
                                        // Ratios adaptativos
                                        "aspect-[4/4] sm:aspect-[4/5] md:aspect-[1/1]",
                                        isZoomed ? "cursor-crosshair" : activeSrc ? "cursor-zoom-in" : "cursor-default",
                                        "select-none will-change-[background-position,background-size]",
                                        "transition-shadow hover:shadow-md"
                                    ].join(" ")}
                                    style={{
                                        backgroundImage: activeSrc ? `url(${activeSrc})` : "none",
                                        backgroundPosition: isZoomed ? bgPos : "center",
                                        backgroundSize: isZoomed ? "220%" : "contain",
                                    }}
                                    onMouseEnter={() => setIsZoomed(true)}
                                    onMouseLeave={() => setIsZoomed(false)}
                                    onMouseMove={handleMouseMove}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    {!activeSrc && (
                                        <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
                                            Sin imagen
                                        </div>
                                    )}

                                    {/* Precarga */}
                                    {activeSrc && (
                                        <img
                                            src={activeSrc}
                                            alt=""
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 h-0 w-0 opacity-0"
                                            decoding="async"
                                            fetchpriority="high"
                                        />
                                    )}

                                    {/* Botón de pantalla completa flotante */}
                                    {activeSrc && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openLightbox();
                                            }}
                                            className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-md bg-white/95 px-3 py-1.5 text-xs font-medium text-zinc-800 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            aria-label="Ver a pantalla completa"
                                        >
                                            <ArrowsPointingOutIcon className="size-4" />
                                            <span className="hidden sm:inline">Pantalla completa</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="aspect-square w-full rounded-xl bg-white shadow-sm" />
                    )}
                </div>

                {/* Columna derecha */}
                <div className="lg:col-span-5 xl:col-span-4">
                    <Breadcrumbs segments={segments} />
                    {/* Título y marca */}
                    <div className="space-y-1">
                        {brand && <p className="text-sm font-medium text-zinc-500">{brand}</p>}
                        <h1 className="text-2xl font-semibold text-zinc-900">{title}</h1>
                    </div>

                    {/* Precios */}
                    <div className="mt-4 flex items-end gap-3">
                        <p className="text-3xl font-bold text-zinc-900">{money(price)}</p>
                        {hasDiscount && (
                            <>
                                <p className="text-lg text-zinc-400 line-through">{money(oldPrice)}</p>
                                {typeof discountPercent === "number" && (
                                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                    -{discountPercent}%
                  </span>
                                )}
                            </>
                        )}
                    </div>
                    {hasDiscount && typeof savings === "number" && (
                        <p className="mt-1 text-sm text-emerald-700">Ahorrás {money(savings)}</p>
                    )}

                    {/* Badges de beneficio */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {!outOfStock && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
                <CheckCircleIcon className="size-4" />
                En stock{isFiniteStock ? ` · ${stock} u.` : ""}
              </span>
                        )}
                        {freeShipping && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100">
                <TruckIcon className="size-4" />
                Envío gratis
              </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200">
              <ShieldCheckIcon className="size-4" />
              Garantía oficial
            </span>
                    </div>

                    {/* Cantidad */}
                    <div className="mt-6 flex items-center gap-3">
                        <div className="flex items-center rounded-lg ring-1 ring-zinc-300 bg-white">
                            <button
                                type="button"
                                className="px-3 py-2 text-zinc-700 hover:bg-zinc-50 disabled:opacity-30"
                                onClick={() => handleQtyChange(qty - 1)}
                                disabled={qty <= 1}
                                aria-label="Disminuir"
                            >
                                –
                            </button>
                            <input
                                id={qtyId}
                                type="number"
                                min={1}
                                max={isFiniteStock ? stock : undefined}
                                value={qty}
                                onChange={(e) => handleQtyChange(parseInt(e.target.value, 10))}
                                className="w-16 border-0 bg-transparent text-center outline-none [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                                type="button"
                                className="px-3 py-2 text-zinc-700 hover:bg-zinc-50 disabled:opacity-30"
                                onClick={() => handleQtyChange(qty + 1)}
                                disabled={isFiniteStock && qty >= stock}
                                aria-label="Aumentar"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={!isQtyValid || outOfStock}
                            className={[
                                "inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition",
                                outOfStock
                                    ? "bg-zinc-200 text-zinc-500 cursor-not-allowed"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700",
                            ].join(" ")}
                        >
                            {outOfStock ? "Sin stock" : "Agregar al carrito"}
                        </button>

                        <div aria-live="polite" className="min-h-[1.25rem]">
                            {added && <span className="text-sm text-emerald-700">Agregado al carrito</span>}
                        </div>
                    </div>

                    {/* Beneficios secundarios */}
                    <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <li className="flex items-center gap-2 text-zinc-700">
                            <TruckIcon className="size-5 text-zinc-500" />
                            Envío rápido
                        </li>
                        <li className="flex items-center gap-2 text-zinc-700">
                            <ShieldCheckIcon className="size-5 text-zinc-500" />
                            Garantía oficial
                        </li>
                        <li className="flex items-center gap-2 text-zinc-700">
                            <CheckCircleIcon className="size-5 text-zinc-500" />
                            Pagos seguros
                        </li>
                    </ul>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    onClick={closeLightbox}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") closeLightbox();
                        if (e.key === "ArrowLeft") goPrev(e);
                        if (e.key === "ArrowRight") goNext(e);
                    }}
                    tabIndex={-1}
                >
                    <div className="absolute inset-0 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative w-full max-w-6xl">
                            <button
                                type="button"
                                className="absolute -top-2 -right-2 z-10 rounded-full bg-white/95 px-3 py-1 text-sm text-zinc-800 shadow hover:bg-white"
                                onClick={closeLightbox}
                                aria-label="Cerrar"
                            >
                                Cerrar
                            </button>

                            <div
                                className="w-full rounded-xl bg-black/20 bg-no-repeat"
                                style={{
                                    backgroundImage: activeSrc ? `url(${activeSrc})` : "none",
                                    backgroundPosition: bgPos,
                                    backgroundSize: "contain",
                                }}
                                onMouseMove={handleMouseMove}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9]" />
                            </div>

                            {gallery.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={goPrev}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-zinc-800 shadow hover:bg-white"
                                        aria-label="Anterior"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        type="button"
                                        onClick={goNext}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-zinc-800 shadow hover:bg-white"
                                        aria-label="Siguiente"
                                    >
                                        ›
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Descripción */}
            <div className="mt-12 border-t border-zinc-200 pt-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-2">Descripción</h2>
                <p className="whitespace-pre-line text-zinc-700 leading-relaxed">
                    {description || "Sin descripción disponible."}
                </p>
            </div>

            <RelatedProductsSection
                excludeId={product.id}
                category={category}
                subcategory={subcategory}
            />
        </section>
    );
}
