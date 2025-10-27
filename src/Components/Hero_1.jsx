import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { productUrl } from "../routes/paths";
import { selectHomeHero, selectHomeStatus } from "../store/homeScreen/homeScreenSlice.js";
import HeroSkeleton from "./HeroSkeleton.jsx";

export default function HeroShowcase() {
    // Cambios: usar únicamente datos del slice `homeScreen` y filtrar por `hero === true`.
    // Se elimina el fallback a `products` para garantizar que el componente solo use el slice requerido.
    const slidesFromSelector = useSelector(selectHomeHero);
    const statusFromSelector = useSelector(selectHomeStatus);

    const slides = useMemo(
        () => (Array.isArray(slidesFromSelector) ? slidesFromSelector.filter((s) => s?.hero === true) : []),
        [slidesFromSelector]
    );
    const status = statusFromSelector ?? "succeeded";

    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    // Forzamos modo claro y eliminamos el toggle de UI
    const lightMode = true;
    const timerRef = useRef(null);

    // Si cambian las slides, asegurar que el índice esté dentro del rango
    useEffect(() => {
        if (!slides || slides.length === 0) {
            setIndex(0);
            return;
        }
        if (index >= slides.length) setIndex(0);
    }, [slides, index]);

    const next = useCallback(() => {
        if (!slides || slides.length === 0) return;
        setIndex((i) => (i + 1) % slides.length);
    }, [slides]);
    const prev = useCallback(() => {
        if (!slides || slides.length === 0) return;
        setIndex((i) => (i - 1 + slides.length) % slides.length);
    }, [slides]);

    useEffect(() => {
        if (paused) return;
        if (!slides || slides.length === 0) return;
        timerRef.current = setInterval(next, 6000);
        return () => clearInterval(timerRef.current);
    }, [paused, next, slides]);

    // Mostrar skeleton si estamos cargando o no hay slides aún
    if (status === 'loading' || !slides || slides.length === 0) return <HeroSkeleton />;

    const medium = slides[index % slides.length];
    const large = slides[(index + 1) % slides.length];
    const small1 = slides[(index + 2) % slides.length];
    const small2 = slides[(index + 3) % slides.length];

    return (
        // usar fondo totalmente blanco en modo claro para que las imágenes no queden "lavadas"
        <section className={`w-full ${lightMode ? 'bg-white text-black' : 'bg-gradient-to-br from-slate-800 via-black to-slate-900 text-white'}`}>
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-screen-2xl mx-auto">
                <div
                    className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[280px_140px] xl:grid-rows-[340px_160px] gap-4 lg:gap-6"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    {/* Arriba izquierda */}
                    <SlideCard slide={medium} className="h-full" medium lightMode={lightMode} />

                    {/* Derecha ocupa 2 filas */}
                    <SlideCard slide={large} className="lg:row-span-2 h-full" large lightMode={lightMode} />

                    {/* Abajo izquierda */}
                    <div className="grid grid-cols-2 gap-4">
                        <SlideCard slide={small1} className="h-full" small lightMode={lightMode} />
                        <SlideCard slide={small2} className="h-full" small lightMode={lightMode} />
                    </div>
                </div>

                {/* Controles */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {slides.map((s, i) => (
                            <button
                                key={s?.id ?? i}
                                onClick={() => setIndex(i)}
                                className={`h-2 w-8 rounded-full transition-all ${
                                    i === index
                                        ? lightMode ? "bg-slate-800" : "bg-slate-200"
                                        : lightMode ? "bg-slate-300/40 hover:bg-slate-400/70" : "bg-slate-500/40 hover:bg-slate-400/70"
                                }`}
                            />
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <Ctrl onClick={prev} label="Anterior" lightMode={lightMode} />
                        <Ctrl onClick={next} label="Siguiente" lightMode={lightMode} />
                        {/* Toggle de modo eliminado: la app muestra solo modo claro aquí */}
                    </div>
                </div>
            </div>
        </section>
    );
}

function SlideCard({ slide, className = "", medium = false, large = false, lightMode = false }) {
    const lines = useMemo(() => (slide?.title || "").split("\n"), [slide?.title]);
    const navigate = useNavigate();
    const [isHover, setIsHover] = useState(false);

    // Escalas tipográficas
    const titleClasses =
        large
            ? "text-4xl sm:text-5xl md:text-6xl"
            : medium
                ? "text-2xl sm:text-3xl md:text-4xl"
                : "text-base sm:text-lg";

    const descClasses =
        large ? "text-base sm:text-lg"
            : medium ? "text-sm sm:text-base"
                : "text-[11px] sm:text-xs";

    // Config de cápsula por tamaño (transparencia, radios, padding)
    const cfg = useMemo(() => {
        if (large)  return { insetX: "inset-x-4", bottom: "bottom-4",  radius: "rounded-[32px]", padX: "px-6 md:px-8", padY: "py-5 md:py-6", alpha: 0.56, ring: "ring-white/10" };
        if (medium) return { insetX: "inset-x-4", bottom: "bottom-4",  radius: "rounded-[28px]", padX: "px-5 md:px-6", padY: "py-4 md:py-5", alpha: 0.52, ring: "ring-white/10" };
        return             { insetX: "inset-x-3", bottom: "bottom-3",  radius: "rounded-[24px]", padX: "px-4",       padY: "py-3.5",     alpha: 0.46, ring: "ring-white/5"  };
    }, [large, medium]);

    return (
        <Motion.article
            layoutId={String(slide?.id)}
            // Efecto más sutil: escala reducida, sombra suave y ligero lift (y)
            animate={{ scale: isHover ? 1.03 : 1, y: isHover ? -4 : 0, boxShadow: isHover ? '0 12px 24px rgba(2,6,23,0.35)' : '0 0px 0px rgba(0,0,0,0)', z: isHover ? 10 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 26, mass: 0.6 }}
            className={`relative overflow-hidden rounded-3xl cursor-pointer transform-gpu transition-transform duration-300 ease-out will-change-transform ${lightMode ? 'border border-slate-300/40 bg-transparent' : 'border border-slate-700/40 bg-slate-900'} ${className}`}
            onClick={() => navigate(productUrl(slide?.id))}
            role="link"
            tabIndex={0}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(productUrl(slide?.id));
                }
            }}
        >
            {/* Imagen */}
            <figure className="absolute inset-0">
                {slide?.mediaSrc?.[0] && (
                    <img
                        src={slide?.mediaSrc?.[0]}
                        alt={slide?.title}
                        // la imagen no hace zoom por separado; el zoom aplica al bloque completo
                        // No queremos que la imagen capture eventos; el article maneja hover/click
                        className={`h-full w-full object-cover pointer-events-none ${lightMode ? 'opacity-100' : 'opacity-50'}`}
                        draggable={false}
                    />
                )}
                {/* Overlay general leve */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/8 to-transparent pointer-events-none" />
            </figure>

            {/* CÁPSULA: banda inferior ancho completo, altura según contenido */}
            <div
                className={`absolute ${cfg.insetX} ${cfg.bottom} ${cfg.radius} pointer-events-none ring-1 ${cfg.ring} z-30`}
                style={{
                    background: `linear-gradient(to top,
            rgba(0,0,0,${cfg.alpha}) 0%,
            rgba(0,0,0,${Math.max(cfg.alpha - 0.18, 0)}) 55%,
            rgba(0,0,0,0) 100%)`,
                    backdropFilter: "blur(5px)",
                    WebkitBackdropFilter: "blur(5px)",
                }}
            >
                {/* Texto dentro de la cápsula (no captura eventos, el Link de arriba sí) */}
                <div className={`pointer-events-none ${cfg.padX} ${cfg.padY}`}>
                    <h3 className={`leading-tight text-white drop-shadow-md ${titleClasses}`}>
                        {lines.map((line, i) => (
                            <span
                                key={i}
                                className={i === lines.length - 1 ? "block font-semibold" : "block font-light"}
                            >
                {line}
              </span>
                        ))}
                    </h3>

                    <p className={`mt-2 text-slate-100/90 ${descClasses}`}>
                        {slide?.description}
                    </p>
                </div>
            </div>
        </Motion.article>
    );
}


function Ctrl({ onClick, label, lightMode }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${lightMode ? 'border border-slate-300/40 bg-white/40 hover:bg-white/60 text-slate-900' : 'border border-slate-600/40 bg-slate-700/40 hover:bg-slate-700/60 text-slate-200'}`}
            aria-label={label}
        >
            {label}
        </button>
    );
}
