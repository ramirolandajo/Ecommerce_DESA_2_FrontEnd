import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { tiles, categories } from "../data/Products.js";
import GlassProductCard from "../Components/GlassProductCard.jsx";
import FilterSidebar from "../Components/FilterSidebar.jsx";

export default function Shop() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query")?.toLowerCase() || "";
    const initialMin = searchParams.get("min") ?? "";
    const initialMax = searchParams.get("max") ?? "";

    const [category, setCategory] = useState("All");
    const [subcategory, setSubcategory] = useState("");
    const [min, setMin] = useState(initialMin);
    const [max, setMax] = useState(initialMax);

    const filtered = useMemo(() => {
        const q = query.trim();
        return tiles.filter((t) => {
            const matchesCat = category === "All" ? true : t.category === category;
            const matchesSub = subcategory ? t.subcategory === subcategory : true;
            const price = typeof t.price === "number" ? t.price : 0;
            const matchesMin = min === "" ? true : price >= Number(min);
            const matchesMax = max === "" ? true : price <= Number(max);
            const matchesQuery = q
                ? t.title?.toLowerCase().includes(q)
                      || t.description?.toLowerCase().includes(q)
                      || t.category?.toLowerCase().includes(q)
                      || t.subcategory?.toLowerCase().includes(q)
                : true;
            return matchesCat && matchesSub && matchesMin && matchesMax && matchesQuery;
        });
    }, [category, subcategory, min, max, query]);

    return (
        <>
            <FilterSidebar
                categories={categories}
                category={category}
                subcategory={subcategory}
                min={min}
                max={max}
                onCategory={(val) => {
                    setCategory(val);
                    setSubcategory("");
                }}
                onSubcategory={setSubcategory}
                onMin={setMin}
                onMax={setMax}
            />
            <section className="mx-auto max-w-7xl px-4 py-8 md:ml-64">
                <h1 className="mb-6 text-2xl font-bold">Shop</h1>

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
        </>
    );
}

