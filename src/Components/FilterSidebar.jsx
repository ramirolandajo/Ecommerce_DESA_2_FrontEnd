import { useMemo, useState } from "react";
import CategoryButton from "./CategoryButton.jsx";
import { FunnelIcon } from "@heroicons/react/24/outline";

export default function FilterSidebar({
  categories = [],
  category = "All",
  subcategory = "",
  min = "",
  max = "",
  onCategory,
  onSubcategory,
  onMin,
  onMax,
}) {
  const [open, setOpen] = useState(false);

  const allCategories = useMemo(
    () => [{ name: "All", subs: [] }, ...(Array.isArray(categories) ? categories : [])],
    [categories]
  );

  const current = allCategories.find((c) => c.name === category) || allCategories[0];
  const subcats = current?.subs ?? [];

  return (
    <>
      {!open && (
        <button
          type="button"
          aria-label="Abrir filtros"
          className="md:hidden fixed top-20 left-4 z-20 inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          onClick={() => setOpen(true)}
        >
          <FunnelIcon className="h-5 w-5" />
          <span className="sr-only sm:not-sr-only">Filtros</span>
        </button>
      )}

      <aside
        className={`fixed top-16 left-0 z-10 h-[calc(100vh-4rem)] overflow-y-auto w-64 bg-white p-4 border-r border-zinc-200 transform transition-transform md:sticky md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Cerrar en mobile */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            type="button"
            className="inline-flex items-center rounded-2xl border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50"
            onClick={() => setOpen(false)}
          >
            Cerrar
          </button>
        </div>

        {/* Categoría */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-zinc-600">Categoría</label>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((c) => (
              <CategoryButton
                key={c.name}
                name={c.name}
                selected={category === c.name}
                onClick={() => {
                  onCategory?.(c.name);
                  onSubcategory?.("");
                }}
              />
            ))}
          </div>
        </div>

        {/* Subcategoría */}
        {subcats.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm mb-1 text-zinc-600">Subcategoría</label>
            <div className="flex flex-wrap gap-2">
              <CategoryButton
                name="Todas"
                selected={subcategory === ""}
                onClick={() => onSubcategory?.("")}
                className="px-3 py-1"
              />
              {subcats.map((s) => (
                <CategoryButton
                  key={s}
                  name={s}
                  selected={subcategory === s}
                  onClick={() => onSubcategory?.(s)}
                  className="px-3 py-1"
                />
              ))}
            </div>
          </div>
        )}

        {/* Precio */}
        <div className="mb-4">
          <label htmlFor="minPrice" className="block text-sm mb-1 text-zinc-600">
            Precio mín.
          </label>
          <input
            id="minPrice"
            type="number"
            inputMode="numeric"
            value={min}
            onChange={(e) => onMin?.(e.target.value)}
            className="w-full rounded border border-zinc-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="maxPrice" className="block text-sm mb-1 text-zinc-600">
            Precio máx.
          </label>
          <input
            id="maxPrice"
            type="number"
            inputMode="numeric"
            value={max}
            onChange={(e) => onMax?.(e.target.value)}
            className="w-full rounded border border-zinc-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
        </div>
      </aside>
    </>
  );
}
