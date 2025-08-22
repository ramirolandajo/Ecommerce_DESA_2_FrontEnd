import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { tiles } from "../data/Products.js";
import GlassProductCard from "../Components/GlassProductCard.jsx";

export default function Shop() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query")?.toLowerCase() || "";
    const initialMin = searchParams.get("min") ?? "";
    const initialMax = searchParams.get("max") ?? "";

    const [category, setCategory] = useState("All");
    const [min, setMin] = useState(initialMin);
    const [max, setMax] = useState(initialMax);

    const categories = useMemo(() => {
        const set = new Set(["All"]);
        tiles.forEach((t) => t?.category && set.add(t.category));
        return Array.from(set);
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim();
        return tiles.filter((t) => {
            const matchesCat = category === "All" ? true : t.category === category;
            const price = typeof t.price === "number" ? t.price : 0;
            const matchesMin = min === "" ? true : price >= Number(min);
            const matchesMax = max === "" ? true : price <= Number(max);
            const matchesQuery = q
                ? t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
                : true;
            return matchesCat && matchesMin && matchesMax && matchesQuery;
        });
    }, [category, min, max, query]);

    return (
        <section className="mx-auto max-w-7xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold">Shop</h1>

            <div className="mb-8 flex flex-wrap gap-4 items-end">
                <label className="flex flex-col text-sm">
                    <span className="mb-1 text-zinc-600">Categoría</span>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded border border-zinc-300 px-3 py-2 text-sm"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </label>

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

            {filtered.length === 0 ? (
                <p className="text-sm text-zinc-500">No hay productos para esta combinación.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((item) => (
                        <GlassProductCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </section>
    );
}

