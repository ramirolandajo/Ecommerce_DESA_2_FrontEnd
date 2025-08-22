import { useMemo, useState } from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";

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
                    type="button"
                    aria-label="Abrir filtros"
                    className="md:hidden mb-4 inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                    onClick={() => setOpen(true)}
                >
                    <FunnelIcon className="h-5 w-5" />
                    <span className="sr-only sm:not-sr-only">Filtros</span>
                </button>
            )}
            <aside
                className={`fixed left-0 top-0 z-10 h-full w-64 bg-white p-4 border-r border-zinc-200 transform transition-transform md:translate-x-0 ${
                    open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}
            >
                <div className="md:hidden flex justify-end mb-4">
                    <button
                        className="border border-zinc-300 px-2 py-1 rounded"
                        onClick={() => setOpen(false)}
                    >
                        Cerrar
                    </button>
                </div>
                <div className="mb-4">
                    <label className="block text-sm mb-1 text-zinc-600">Categoría</label>
                    <select
                        value={category}
                        onChange={(e) => {
                            onCategory(e.target.value);
                            onSubcategory("");
                        }}
                        className="w-full rounded border border-zinc-300 px-2 py-1"
                    >
                        {allCategories.map((c) => (
                            <option key={c.name} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
                {subcats.length > 0 && (
                    <div className="mb-4">
                        <label className="block text-sm mb-1 text-zinc-600">Subcategoría</label>
                        <select
                            value={subcategory}
                            onChange={(e) => onSubcategory(e.target.value)}
                            className="w-full rounded border border-zinc-300 px-2 py-1"
                        >
                            <option value="">Todas</option>
                            {subcats.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
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

