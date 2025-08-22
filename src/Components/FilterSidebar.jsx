import { useMemo } from "react";
import { categories } from "../data/Products.js";

export default function FilterSidebar({
    category,
    setCategory,
    subcategory,
    setSubcategory,
    min,
    setMin,
    max,
    setMax,
}) {
    const categoryOptions = useMemo(() => {
        return ["All", ...categories.map((c) => c.category)];
    }, []);

    const subcategoryOptions = useMemo(() => {
        if (category === "All") return [];
        const found = categories.find((c) => c.category === category);
        return found ? ["All", ...found.subcategories] : [];
    }, [category]);

    return (
        <div className="mb-8 flex flex-wrap gap-4 items-end">
            <label className="flex flex-col text-sm">
                <span className="mb-1 text-zinc-600">Categoría</span>
                <select
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setSubcategory("All");
                    }}
                    className="rounded border border-zinc-300 px-3 py-2 text-sm"
                >
                    {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </label>

            {subcategoryOptions.length > 0 && (
                <label className="flex flex-col text-sm">
                    <span className="mb-1 text-zinc-600">Subcategoría</span>
                    <select
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        className="rounded border border-zinc-300 px-3 py-2 text-sm"
                    >
                        {subcategoryOptions.map((sub) => (
                            <option key={sub} value={sub}>
                                {sub}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            <label className="flex flex-col text-sm">
                <span className="mb-1 text-zinc-600">Precio mín.</span>
                <input
                    type="number"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    className="w-24 rounded border border-zinc-300 px-3 py-2"
                />
            </label>

            <label className="flex flex-col text-sm">
                <span className="mb-1 text-zinc-600">Precio máx.</span>
                <input
                    type="number"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                    className="w-24 rounded border border-zinc-300 px-3 py-2"
                />
            </label>
        </div>
    );
}

