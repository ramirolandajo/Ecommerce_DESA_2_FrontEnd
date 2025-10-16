// src/sections/ProductTilesSection.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import GlassProductCard from "../Components/GlassProductCard.jsx";
import HomeProductSkeleton from "../Components/HomeProductSkeleton.jsx";
import { getCategoryIcon } from "../data/categoryIcons.js";
import { selectAllProducts } from "../store/products/productsSlice.js";
import { selectHomeStatus, selectHomeProducts } from "../store/homeScreen/homeScreenSlice.js";

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
  // Usamos los productos del store general y también los del home (si están disponibles)
  const productsFromAll = useSelector(selectAllProducts);
  const homeStatus = useSelector(selectHomeStatus);
  const productsFromHome = useSelector(selectHomeProducts);
  const products = productsFromHome.length > 0 ? productsFromHome : productsFromAll;
  const status = homeStatus;
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
    const allCategories = Array.from(set);
    // Separar conocidas y desconocidas
    const known = order.filter((cat) => allCategories.includes(cat));
    const unknown = allCategories.filter((cat) => !order.includes(cat) && cat !== "All").sort();
    // Unir: primero All, luego conocidas, luego desconocidas
    const result = ["All", ...known.filter((c) => c !== "All"), ...unknown];
    return result.map((name) => ({ key: name, label: CATEGORY_LABELS[name] ?? name }));
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
    <section className="relative py-12 sm:py-16 bg-zinc-50" data-testid="product-tiles-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabecera: título + subtítulo */}
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">Seleccionados para ti</h2>
            <p className="mt-2 text-sm text-zinc-600 max-w-2xl">Una selección cuidada de productos populares y novedades. Mantén el hero como referencia y explora lo que sigue.</p>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-3">
            <nav className="flex gap-3 text-sm font-medium text-zinc-500">
              {TABS.map((t) => {
                const active = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={[
                      "relative rounded-full px-4 py-2 transition",
                      active ? "bg-zinc-900 text-white shadow" : "bg-white text-zinc-700 hover:bg-zinc-100",
                    ].join(" ")}
                  >
                    {t.label}
                  </button>
                );
              })}
            </nav>
            <Link to="/shop" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">Ver todos</Link>
          </div>
        </div>

        {/* Browse by Category */}
        <div className="mb-6 sm:mb-8">
          <h3 className="mb-3 text-base sm:text-lg font-semibold text-zinc-900 text-center">Explorar por categoría</h3>
          <div className="overflow-x-auto">
            <div className="flex gap-3 px-2 py-2">
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.key);
                return (
                  <Link
                    key={cat.key}
                    to={`/shop?category=${encodeURIComponent(cat.key)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-base whitespace-nowrap transition transform hover:-translate-y-1 hover:shadow-md shadow-sm text-zinc-700 border border-zinc-100"
                  >
                    <Icon className="w-5 h-5 text-zinc-600" aria-hidden="true" />
                    <span className="font-medium">{cat.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        {status === "loading" || (products.length === 0 && status === 'idle') ? (
          // Si el home está cargando O no hay productos aún (estado idle pero vacío), mostramos skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <HomeProductSkeleton key={idx} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center">No hay productos para esta combinación.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((item) => (
              <GlassProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
