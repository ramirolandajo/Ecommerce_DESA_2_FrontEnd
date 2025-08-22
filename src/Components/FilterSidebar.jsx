import { useMemo, useState } from "react";
import CategoryButton from "./CategoryButton.jsx";

export default function FilterSidebar({
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
    const [open, setOpen] = useState(false);

    const allCategories = useMemo(
        () => [{ name: "All", subs: [] }, ...categories],
        [categories]
    );

    const current = allCategories.find((c) => c.name === category);
    const subcats = current?.subs ?? [];

    return (
        <>
                {!open && (
                    <button
                        className="md:hidden mb-4 inline-flex items-center rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50"
                        onClick={() => setOpen(true)}
                    >
                        Filtros
                    </button>
                )}
            <aside
                className={`fixed left-0 top-0 z-10 h-full w-64 bg-white p-4 border-r border-zinc-200 transform transition-transform md:translate-x-0 ${
                    open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}
            >
                  <div className="md:hidden flex justify-end mb-4">
                      <button
                          className="inline-flex items-center rounded-2xl border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50"
                          onClick={() => setOpen(false)}
                      >
                          Cerrar
                      </button>
                  </div>
                <div className="mb-4">
                    <label className="block text-sm mb-1 text-zinc-600">Categoría</label>
                    <div className="flex flex-wrap gap-2">
                        {allCategories.map((c) => (
                            <CategoryButton
                                key={c.name}
                                name={c.name}
                                selected={category === c.name}
                                onClick={() => {
                                    onCategory(c.name);
                                    onSubcategory("");
                                }}
                            />
                        ))}
                    </div>
                </div>
                {subcats.length > 0 && (
                    <div className="mb-4">
                        <label className="block text-sm mb-1 text-zinc-600">Subcategoría</label>
                        <div className="flex flex-wrap gap-2">
                            <CategoryButton
                                name="Todas"
                                selected={subcategory === ""}
                                onClick={() => onSubcategory("")}
                                className="px-3 py-1"
                            />
                            {subcats.map((s) => (
                                <CategoryButton
                                    key={s}
                                    name={s}
                                    selected={subcategory === s}
                                    onClick={() => onSubcategory(s)}
                                    className="px-3 py-1"
                                />
                            ))}
                        </div>
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-sm mb-1 text-zinc-600">Precio mín.</label>
                    <input
                        type="number"
                        value={min}
                        onChange={(e) => onMin(e.target.value)}
                        className="w-full rounded border border-zinc-300 px-2 py-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm mb-1 text-zinc-600">Precio máx.</label>
                    <input
                        type="number"
                        value={max}
                        onChange={(e) => onMax(e.target.value)}
                        className="w-full rounded border border-zinc-300 px-2 py-1"
                    />
                </div>
            </aside>
        </>
    );
}

