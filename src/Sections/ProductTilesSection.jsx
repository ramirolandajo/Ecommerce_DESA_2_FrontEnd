// src/sections/ProductTilesSection.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import GlassProductCard from "../Components/GlassProductCard.jsx";
import HomeProductSkeleton from "../Components/HomeProductSkeleton.jsx";
import { getCategoryIcon } from "../data/categoryIcons.js";

const TABS = [
  { key: "new", label: "Novedades" },
  { key: "bestseller", label: "Más vendidos" },
  { key: "featured", label: "Productos destacados" },
];

const CATEGORY_LABELS = {
  All: "Todos",
  Phones: "Teléfonos",
  "Smart Watches": "Relojes inteligentes",
  Cameras: "Cámaras",
  Headphones: "Auriculares",
  Computers: "Computadoras",
  Gaming: "Videojuegos",
};

export default function ProductTilesSection() {
  const { items: products, status } = useSelector((s) => s.products);
  const [activeTab, setActiveTab] = useState("new");

  // categorías dinámicas (ordenadas como en el mock)
  const categories = useMemo(() => {
    const set = new Set(["All"]);
    (products ?? []).forEach((p) => {
      const names = Array.isArray(p?.categories)
        ? p.categories
            .map((c) => (typeof c === "string" ? c : c?.name))
            .filter(Boolean)
        : [];
      names.forEach((n) => set.add(n));
    });

    const order = [
      "All",
      "Phones",
      "Smart Watches",
      "Cameras",
      "Headphones",
      "Computers",
      "Gaming",
    ];
    const result = Array.from(set);
    return result
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .map((name) => ({ key: name, label: CATEGORY_LABELS[name] ?? name }));
  }, [products]);

  const filtered = useMemo(() => {
    return (products ?? []).filter((t) => {
      const flagsPresent = "isNew" in t || "isBestseller" in t || "isFeatured" in t;
      const byTab =
        activeTab === "new"
          ? !!t.isNew
          : activeTab === "bestseller"
          ? !!t.isBestseller
          : !!t.isFeatured;
      const fallback = activeTab === "new" && !flagsPresent; // si no hay flags, se muestran en "New"
      return byTab || fallback;
    });
  }, [products, activeTab]);

  return (
    <section className="relative py-10 sm:py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Browse by Category */}
        <div className="mb-6 sm:mb-8 text-center">
          <h3 className="mb-3 text-base sm:text-lg font-semibold text-zinc-900">
            Explorar por categoría
          </h3>

            <div className="overflow-x-auto flex gap-3">
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.key);
                return (
                  <Link
                    key={cat.key}
                    to={`/shop?category=${encodeURIComponent(cat.key)}`}
                    className="inline-flex items-center gap-2 rounded-2xl border px-6 py-4 text-base whitespace-nowrap transition bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    <span>{cat.label}</span>
                  </Link>
                );
              })}
            </div>
        </div>

        {/* Tabs */}
        <header className="mb-6 sm:mb-8">
          <nav className="flex justify-center gap-8 text-sm font-medium text-zinc-500">
            {TABS.map((t) => {
              const active = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={[
                    "relative pb-2 transition-colors",
                    active ? "text-zinc-900" : "hover:text-zinc-700",
                  ].join(" ")}
                >
                  {t.label}
                  <span
                    className={[
                      "absolute left-0 -bottom-[2px] h-[2px] w-full rounded",
                      active ? "bg-zinc-900" : "bg-transparent",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </nav>
        </header>

        {/* Grid de productos */}
        {status === "loading" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <HomeProductSkeleton key={idx} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center">
            No hay productos para esta combinación.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <GlassProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
