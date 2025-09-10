import React, { useMemo } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function FilterSidebar({
                                          open,
                                          onClose,
                                          categories,
                                          category,
                                          subcategory,
                                          min,
                                          max,
                                          onCategory,
                                          onSubcategory,
                                          onMin,
                                          onMax,
                                      }) {
    const allCategories = useMemo(
        () => [{ name: "Todas", subs: [] }, ...(categories || [])],
        [categories]
    );
    const current = allCategories.find((c) => c.name === category) || allCategories[0];
    const subcats = current?.subs ?? [];

    const reset = () => {
        onCategory("Todas");
        onSubcategory("");
        onMin("");
        onMax("");
    };

    const FiltersUI = (
        <div className="flex flex-col space-y-6 ">
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Categoría</label>
                <select
                    className="w-full h-10 rounded-2xl border border-zinc-300 bg-white px-3 text-sm text-zinc-800 shadow-sm"
                    value={category}
                    onChange={(e) => onCategory(e.target.value)}
                >
                    {allCategories.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                </select>
            </div>

            {subcats.length > 0 && (
                <div className="space-y-2">
                    <label className=" text-sm font-medium text-zinc-700">Subcategoría</label>
                    <select
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
                <label className="text-sm font-medium text-zinc-700">Precio mín.</label>
                <input
                    type="number"
                    inputMode="numeric"
                    className="w-full h-10 rounded-2xl border border-zinc-300 bg-white px-3 text-sm text-zinc-800 shadow-sm"
                    value={min}
                    onChange={(e) => onMin(e.target.value)}
                    placeholder="0"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Precio máx.</label>
                <input
                    type="number"
                    inputMode="numeric"
                    className="w-full h-10 rounded-2xl border border-zinc-300 bg-white px-3 text-sm text-zinc-800 shadow-sm"
                    value={max}
                    onChange={(e) => onMax(e.target.value)}
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
            {/* Sidebar para Desktop (sin cambios) */}
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

            {/* Overlay y panel para Mobile */}
            {open && (
                <div className="md:hidden">
                    {/* Fondo oscuro que cierra el panel al hacer clic */}
                    <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
                    {/* Panel de filtros */}
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