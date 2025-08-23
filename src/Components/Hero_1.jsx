import { useEffect, useRef, useState, useMemo } from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { productUrl } from "../routes/paths";

const slides = [
    {
        id: "ps5",
        brand: "Sony",
        title: "Playstation 5",
        description: "Increíble potencia CPU/GPU y SSD con I/O integrado redefine tu experiencia.",
        cta: { label: "Comprar" },
        media: {
            src: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=627&auto=format&fit=crop",
            alt: "PlayStation 5",
        },
    },
    {
        id: "macbook-air",
        brand: "Apple",
        title: "Macbook\nAir",
        description: "El nuevo MacBook Air 15'' te da espacio de sobra con Liquid Retina Display.",
        cta: { label: "Comprar" },
        media: {
            src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1400&auto=format&fit=crop",
            alt: "Macbook",
        },
    },
    {
        id: "airpods-max",
        brand: "Apple",
        title: "AirPods\nMax",
        description: "Computational audio. Livianos y potentes.",
        cta: { label: "Comprar" },
        media: {
            src: "https://images.unsplash.com/photo-1641893978985-a0c233b14f9b?q=80&w=764&auto=format&fit=crop",
            alt: "AirPods Max",
        },
    },
    {
        id: "vision-pro",
        brand: "Apple",
        title: "Vision\nPro",
        description: "Una forma inmersiva de experimentar entretenimiento.",
        cta: { label: "Comprar" },
        media: {
            src: "https://plus.unsplash.com/premium_photo-1711333057034-f845101448b0?q=80&w=808&auto=format&fit=crop",
            alt: "Vision Pro",
        },
    },
];

export default function HeroShowcase() {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const timerRef = useRef(null);

    const next = () => setIndex((i) => (i + 1) % slides.length);
    const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

    useEffect(() => {
        if (paused) return;
        timerRef.current = setInterval(next, 6000);
        return () => clearInterval(timerRef.current);
    }, [paused]);

    const medium = slides[index % slides.length];
    const large = slides[(index + 1) % slides.length];
    const small1 = slides[(index + 2) % slides.length];
    const small2 = slides[(index + 3) % slides.length];

    return (
        <section className="w-full bg-gradient-to-br from-slate-800 via-black to-slate-900 text-white mt-16 lg:mt-20">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-screen-2xl mx-auto">
                <div
                    className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[280px_140px] xl:grid-rows-[340px_160px] gap-4 lg:gap-6"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    {/* Arriba izquierda */}
                    <SlideCard slide={medium} className="h-full" medium />

                    {/* Derecha ocupa 2 filas */}
                    <SlideCard slide={large} className="lg:row-span-2 h-full" large />

                    {/* Abajo izquierda */}
                    <div className="grid grid-cols-2 gap-4">
                        <SlideCard slide={small1} className="h-full" small />
                        <SlideCard slide={small2} className="h-full" small />
                    </div>
                </div>

                {/* Controles */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {slides.map((s, i) => (
                            <button
                                key={s.id}
                                onClick={() => setIndex(i)}
                                className={`h-2 w-8 rounded-full transition-all ${
                                    i === index
                                        ? "bg-slate-200"
                                        : "bg-slate-500/40 hover:bg-slate-400/70"
                                }`}
                            />
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <Ctrl onClick={prev} label="Prev" />
                        <Ctrl onClick={next} label="Next" />
                    </div>
                </div>
            </div>
        </section>
    );
}

function SlideCard({ slide, className = "", medium = false, large = false }) {
    const lines = useMemo(() => slide.title.split("\n"), [slide.title]);

    return (
        <Motion.article
            layoutId={slide.id}
            className={`relative overflow-hidden rounded-3xl border border-slate-700/40 bg-slate-900 ${className}`}
        >
            <figure className="absolute inset-0">
                <img
                    src={slide.media.src}
                    alt={slide.media.alt}
                    className="h-full w-full object-cover opacity-50"
                    draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </figure>

            <div className="relative flex flex-col justify-end p-4 sm:p-6 md:p-8 h-full">


                {/* Título con mezcla light/bold */}
                <h3
                    className={`leading-tight ${
                        large
                            ? "text-4xl sm:text-5xl md:text-6xl"
                            : medium
                                ? "text-2xl sm:text-3xl md:text-4xl"
                                : "text-base sm:text-lg"
                    }`}
                >
                    {lines.map((line, i) => (
                        <span
                            key={i}
                            className={i === lines.length - 1 ? "block font-semibold" : "block font-light"}
                        >
              {line}
            </span>
                    ))}
                </h3>

                {/* Descripción con tamaño distinto según card */}
                <p
                    className={`mt-2 max-w-md ${
                        large
                            ? "text-base sm:text-lg"
                            : medium
                                ? "text-sm sm:text-base"
                                : "text-[11px] sm:text-xs"
                    } text-slate-200/80`}
                >
                    {slide.description}
                </p>

                {/* CTA */}
                <Link
                    to={productUrl(slide.id)}
                    className={`mt-3 inline-flex items-center justify-center rounded-xl border border-slate-600/50 bg-slate-700/40 ${
                        large
                            ? "px-5 py-2.5 text-sm"
                            : medium
                                ? "px-4 py-2 text-sm"
                                : "px-3 py-1.5 text-[11px]"
                    } font-medium backdrop-blur hover:bg-slate-700/60 text-slate-100`}
                >
                    {slide.cta.label}
                </Link>
            </div>
        </Motion.article>
    );
}

function Ctrl({ onClick, label }) {
    return (
        <button
            onClick={onClick}
            className="rounded-xl border border-slate-600/40 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/30"
            aria-label={label}
        >
            {label}
        </button>
    );
}
