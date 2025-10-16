import React, { useMemo, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { api } from "../api/axios"; // importamos cliente para obtener marcas

export default function FilterSidebar({
  open,
  onClose,
  categories,
  category,
  subcategory,
  min,
  max,
  brand,
  onCategory,
  onSubcategory,
  onMin,
  onMax,
  onBrand,
}) {
  // Aseguramos una opción "All" como centinela; se mostrará como "Todas"
  const allCategories = useMemo(
    () => [{ name: "All", subs: [] }, ...(categories || [])],
    [categories]
  );
  const current = allCategories.find((c) => c.name === category) || allCategories[0];
  const subcats = current?.subs ?? [];

  const [brands, setBrands] = useState([]);

  useEffect(() => {
    let mounted = true;
    api
      .get("/brands/all")
      .then((res) => {
        if (!mounted) return;
        const data = res.data;
        if (Array.isArray(data)) setBrands(data);
        else if (Array.isArray(data.content)) setBrands(data.content);
        else setBrands([]);
      })
      .catch(() => {
        if (!mounted) return;
        setBrands([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const reset = () => {
    onCategory("All");
    onSubcategory("");
    onMin("");
    onMax("");
    if (onBrand) onBrand("");
  };

  // Handlers para evitar negativos en precios. Permitimos string vacío para limpiar.
  const handleMinChange = (e) => {
    const v = e.target.value;
    if (v === "") return onMin("");
    const n = Number(v);
    if (Number.isNaN(n)) return; // ignorar caracteres no numéricos
    onMin(String(Math.max(0, n)));
  };

  const handleMaxChange = (e) => {
    const v = e.target.value;
    if (v === "") return onMax("");
    const n = Number(v);
    if (Number.isNaN(n)) return;
    onMax(String(Math.max(0, n)));
  };

  const FiltersUI = (
    <div className="flex flex-col space-y-6 ">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor="brand-select">Marca</label>
        <select
          id="brand-select"
          className="w-full h-10 rounded-2xl border border-zinc-300 bg-white px-3 text-sm text-zinc-800 shadow-sm"
          value={brand ?? ""}
          onChange={(e) => onBrand && onBrand(e.target.value)}
        >
          <option value="">Todas</option>
          {brands.map((b) => (
            <option key={b.id ?? b.brandCode ?? b.name} value={b.brandCode ?? b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor="category-select">Categoría</label>
        <select
          id="category-select"
          className="w-full h-10 rounded-2xl border border-zinc-300 bg-white px-3 text-sm text-zinc-800 shadow-sm"
          value={category}
          onChange={(e) => onCategory(e.target.value)}
        >
          {allCategories.map((c) => (
            <option key={c.name} value={c.name}>{c.name === "All" ? "Todas" : c.name}</option>
          ))}
        </select>
      </div>

      {subcats.length > 0 && (
        <div className="space-y-2">
          <label className=" text-sm font-medium text-zinc-700" htmlFor="subcategory-select">Subcategoría</label>
          <select
            id="subcategory-select"
            className="w-full h-10 rounded-2xl border border-zinc-300 bg-white px-3 text-sm text-zinc-800 shadow-sm"
            value={subcategory}
            onChange={(e) => onSubcategory(e.target.value)}
          >
            <option value="">Todas</option>
            {subcats.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor="min-price">Precio mín.</label>
        <input
          id="min-price"
          type="number"
          inputMode="numeric"
          min={0}
          className="w-full h-10 rounded-2xl border border-zinc-300 bg-white px-3 text-sm text-zinc-800 shadow-sm"
          value={min}
          onChange={handleMinChange}
          placeholder="0"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor="max-price">Precio máx.</label>
        <input
          id="max-price"
          type="number"
          inputMode="numeric"
          min={0}
          className="w-full h-10 rounded-2xl border border-zinc-300 bg-white px-3 text-sm text-zinc-800 shadow-sm"
          value={max}
          onChange={handleMaxChange}
          placeholder="9999"
        />
      </div>

      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50"
      >
        Limpiar filtros
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop aside solo cuando no está abierto el panel móvil */}
      {!open && (
        <aside
          className="
    hidden md:block
    sticky top-4 self-start
    max-h-[calc(100vh-6rem)] overflow-y-auto
    w-56 border-r border-zinc-200 bg-white
    px-2 py-6
  "
        >
          {FiltersUI}
        </aside>
      )}

      {/* Overlay y panel para Mobile */}
      {open && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
          <div
            className="
                fixed left-0 z-50
                top-0 h-full
                w-[85%] max-w-sm
                bg-white shadow-xl flex flex-col
              "
            role="dialog" aria-modal="true" aria-label="Filtros"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <span className="text-sm font-medium">Filtros</span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1 hover:bg-zinc-100"
                aria-label="Cerrar filtros"
              >
                <XMarkIcon className="h-5 w-5 text-zinc-700" />
              </button>
            </div>
            <div className="h-full overflow-y-auto px-4 py-6">{FiltersUI}</div>
          </div>
        </div>
      )}
    </>
  );
}