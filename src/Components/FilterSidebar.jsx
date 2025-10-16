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
  // nuevo: callback que aplica filtros (no dispara automáticamente al cambiar controles)
  onApply,
  // optional initial filters to populate UI
  initialFilters = {},
}) {
  // Aseguramos una opción "All" como centinela; se mostrará como "Todas"
  const allCategories = useMemo(
    () => [{ name: "All", subs: [] }, ...(categories || [])],
    [categories]
  );
  // not using a single current category; categories list is used for multi-select

  const [brands, setBrands] = useState([]);

  // Estado local del panel (no aplicar hasta que el usuario presione 'Filtrar')
  // categories as a set to allow multiple selection
  const [selectedCategoryNames, setSelectedCategoryNames] = useState(new Set(initialFilters.categoryNames || (category && category !== 'All' ? [category] : [])));
  const [localSubcategory, setLocalSubcategory] = useState(initialFilters.subcategory || subcategory || "");
  const [localMin, setLocalMin] = useState(initialFilters.min ?? (min ?? ""));
  const [localMax, setLocalMax] = useState(initialFilters.max ?? (max ?? ""));
  const [selectedBrandCodes, setSelectedBrandCodes] = useState(new Set(initialFilters.brandCodes || (brand ? [brand] : [])));

  useEffect(() => {
    let mounted = true;
    api
      .get("/brands/all")
      .then((res) => {
        if (!mounted) return;
        const data = res.data;
        const list = Array.isArray(data) ? data : Array.isArray(data.content) ? data.content : [];
        setBrands(list);
      })
      .catch(() => {
        if (!mounted) return;
        setBrands([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Sincronizar estado local cuando cambian los filtros aplicados desde el padre
  useEffect(() => {
    // initialFilters may contain: categoryNames (array), subcategory, min, max, brandCodes (array)
    setSelectedCategoryNames(new Set(initialFilters.categoryNames || []));
    setLocalSubcategory(initialFilters.subcategory || "");
    setLocalMin(initialFilters.min ?? "");
    setLocalMax(initialFilters.max ?? "");
    setSelectedBrandCodes(new Set(initialFilters.brandCodes || []));
  }, [initialFilters]);

  const clearLocal = () => {
    setSelectedCategoryNames(new Set());
    setLocalSubcategory("");
    setLocalMin("");
    setLocalMax("");
    setSelectedBrandCodes(new Set());
    // Notificar al padre para que aplique la limpieza y recargue resultados
    if (onApply) {
      onApply({ categoryNames: [], subcategory: "", min: "", max: "", brandCodes: [] });
    }
  };

  const toggleCategoryName = (name) => {
    setSelectedCategoryNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleBrand = (code) => {
    setSelectedBrandCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleApply = () => {
    const filters = {
      categoryNames: Array.from(selectedCategoryNames),
      subcategory: localSubcategory,
      min: localMin,
      max: localMax,
      brandCodes: Array.from(selectedBrandCodes),
    };
    if (onApply) onApply(filters);
    // opcional: cerrar panel mobile
    if (onClose) onClose();
  };

  // Handlers para evitar negativos en precios. Permitimos string vacío para limpiar.
  const handleMinChange = (e) => {
    const v = e.target.value;
    if (v === "") return setLocalMin("");
    const n = Number(v);
    if (Number.isNaN(n)) return; // ignorar caracteres no numéricos
    setLocalMin(String(Math.max(0, n)));
  };

  const handleMaxChange = (e) => {
    const v = e.target.value;
    if (v === "") return setLocalMax("");
    const n = Number(v);
    if (Number.isNaN(n)) return;
    setLocalMax(String(Math.max(0, n)));
  };

  const FiltersUI = (
    <div className="flex flex-col space-y-6 ">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">Marcas</label>
        <div className="border rounded p-2 bg-white">
          {brands.length === 0 ? (
            <div className="text-sm text-zinc-500">No hay marcas</div>
          ) : (
            brands.map((b) => {
              const code = b.brandCode ?? b.id ?? b.name;
              return (
                <label key={code} className="flex items-center gap-2 text-sm py-1">
                  <input type="checkbox" checked={selectedBrandCodes.has(code)} onChange={() => toggleBrand(code)} />
                  <span>{b.name}</span>
                </label>
              );
            })
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">Categorías</label>
        <div className="border rounded p-2 bg-white">
          {allCategories.filter(c => c.name !== 'All').map((c) => (
            <label key={c.name} className="flex items-center gap-2 text-sm py-1">
              <input type="checkbox" checked={selectedCategoryNames.has(c.name)} onChange={() => toggleCategoryName(c.name)} />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Si está seleccionada una sola categoría, mostramos subcategorías de esa categoría */}
      {selectedCategoryNames.size === 1 && (() => {
        const only = Array.from(selectedCategoryNames)[0];
        const cObj = allCategories.find(cc => cc.name === only);
        const subs = cObj?.subs ?? [];
        return subs.length > 0 ? (
          <div className="space-y-2">
            <label className=" text-sm font-medium text-zinc-700" htmlFor="subcategory-select">Subcategoría</label>
            <select
              id="subcategory-select"
              className="w-full h-10 rounded-2xl border border-zinc-300 bg-white px-3 text-sm text-zinc-800 shadow-sm"
              value={localSubcategory}
              onChange={(e) => setLocalSubcategory(e.target.value)}
            >
              <option value="">Todas</option>
              {subs.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        ) : null;
      })()}

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor="min-price">Precio mín.</label>
        <input
          id="min-price"
          type="number"
          inputMode="numeric"
          min={0}
          className="w-full h-10 rounded-2xl border border-zinc-300 bg-white px-3 text-sm text-zinc-800 shadow-sm"
          value={localMin}
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
          value={localMax}
          onChange={handleMaxChange}
          placeholder="9999"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 inline-flex items-center justify-center rounded-2xl border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Filtrar
        </button>
        <button
          type="button"
          onClick={clearLocal}
          className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50"
        >
          Limpiar filtros
        </button>
      </div>
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
                top-0
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
            <div className="px-4 py-6">{FiltersUI}</div>
          </div>
        </div>
      )}
    </>
  );
}