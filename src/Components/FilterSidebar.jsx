import React, { useMemo, useEffect, useState } from "react";
import { XMarkIcon, TagIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
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
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

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
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 inline-flex items-center justify-center rounded-xl border border-slate-600/50 bg-slate-700/40 px-3 py-2 text-sm font-medium text-slate-100 shadow-sm hover:bg-slate-700/60"
        >
          Filtrar
        </button>
        <button
          type="button"
          onClick={clearLocal}
          className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50"
        >
          Limpiar filtros
        </button>
      </div>

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

      <Disclosure defaultOpen>
        <DisclosureButton className="flex items-center justify-between w-full px-3 py-2 text-left text-sm font-semibold text-zinc-800 hover:bg-zinc-50 rounded-lg transition-colors">
          <span>Marcas</span>
          <ChevronDownIcon className="h-5 w-5 text-zinc-500 transition-transform data-[open]:rotate-180" />
        </DisclosureButton>
        <DisclosurePanel className="mt-2 space-y-2">
          <div className="grid grid-cols-1 gap-2">
            {(showAllBrands ? brands : brands.slice(0, 8)).map((b) => {
              const code = b.brandCode ?? b.id ?? b.name;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => toggleBrand(code)}
                  className={[
                    "inline-flex items-center justify-start px-3 py-2 rounded-xl text-sm transition-all select-none w-full",
                    selectedBrandCodes.has(code)
                      ? "bg-slate-900 text-white shadow-md border border-slate-800"
                      : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 overflow-hidden",
                  ].join(" ")}
                  aria-pressed={selectedBrandCodes.has(code)}
                  title={b.name}
                >
                  <TagIcon className={`h-5 w-5 mr-2 ${selectedBrandCodes.has(code) ? "text-white" : "text-zinc-400"}`} aria-hidden="true" />
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis font-medium">{b.name}</span>
                </button>
              );
            })}
          </div>
          {brands.length > 8 && (
            <div className="mt-3 text-center">
              <button type="button" onClick={() => setShowAllBrands((s) => !s)} className="text-sm text-indigo-600 hover:underline">
                {showAllBrands ? 'Ver menos' : `Ver todas las marcas (${brands.length})`}
              </button>
            </div>
          )}
        </DisclosurePanel>
      </Disclosure>

      <Disclosure defaultOpen>
        <DisclosureButton className="flex items-center justify-between w-full px-3 py-2 text-left text-sm font-semibold text-zinc-800 hover:bg-zinc-50 rounded-lg transition-colors">
          <span>Categorías</span>
          <ChevronDownIcon className="h-5 w-5 text-zinc-500 transition-transform data-[open]:rotate-180" />
        </DisclosureButton>
        <DisclosurePanel className="mt-2 space-y-2">
          <div className="grid grid-cols-1 gap-2">
            {(showAllCategories ? allCategories.filter(c => c.name !== 'All') : allCategories.filter(c => c.name !== 'All').slice(0,8)).map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => toggleCategoryName(c.name)}
                className={[
                  "inline-flex items-center justify-start px-3 py-2 rounded-xl text-sm transition-all select-none w-full",
                  selectedCategoryNames.has(c.name)
                    ? "bg-slate-900 text-white shadow-md border border-slate-800"
                    : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 overflow-hidden",
                ].join(" ")}
                aria-pressed={selectedCategoryNames.has(c.name)}
                title={c.name}
              >
                <TagIcon className={`h-5 w-5 mr-2 ${selectedCategoryNames.has(c.name) ? "text-white" : "text-zinc-400"}`} aria-hidden="true" />
                <span className="whitespace-nowrap overflow-hidden text-ellipsis font-medium">{c.name}</span>
                {typeof c.count === 'number' ? (
                  <span className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs ${selectedCategoryNames.has(c.name) ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-700"}`}>
                    {c.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          {allCategories.filter(c => c.name !== 'All').length > 8 && (
            <div className="mt-3 text-center">
              <button type="button" onClick={() => setShowAllCategories((s) => !s)} className="text-sm text-indigo-600 hover:underline">
                {showAllCategories ? 'Ver menos categorías' : `Ver todas las categorías (${allCategories.filter(c => c.name !== 'All').length})`}
              </button>
            </div>
          )}
        </DisclosurePanel>
      </Disclosure>

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
            w-64
            pr-4
          "
        >
          <div className="
            h-[calc(100vh-2rem)] 
            overflow-y-auto
            border-r border-zinc-200
            px-2 py-6
          ">
            {FiltersUI}
          </div>
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
                h-full
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
            <div className="px-4 py-6 overflow-y-auto flex-1">{FiltersUI}</div>
          </div>
        </div>
      )}
    </>
  );
}
