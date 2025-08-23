import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { tiles, categories } from "../data/Products.js";
import GlassProductCard from "../Components/GlassProductCard.jsx";
import FilterSidebar from "../Components/FilterSidebar.jsx";
import ProductSkeleton from "../Components/ProductSkeleton.jsx";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/outline";

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCat = searchParams.get("category") ?? "All";
    const query = searchParams.get("query")?.toLowerCase() || "";
    const initialMin = searchParams.get("min") ?? "";
    const initialMax = searchParams.get("max") ?? "";

    const [category, setCategory] = useState(initialCat);
    const [subcategory, setSubcategory] = useState("");
    const [min, setMin] = useState(initialMin);
    const [max, setMax] = useState(initialMax);
    const [sort, setSort] = useState("relevance");
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Estado para controlar la visibilidad del sidebar en móvil
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            if (category === "All") params.delete("category");
            else params.set("category", category);
            return params;
        });
    }, [category, setSearchParams]);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            // Simulación de llamada async para cargar productos
            await new Promise((r) => setTimeout(r, 500));
            setProducts(tiles);
            setIsLoading(false);
        };
        load();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim();
        return products.filter((t) => {
            const matchesCat = category === "All" ? true : t.category === category;
            const matchesSub = subcategory ? t.subcategory === subcategory : true;
            const price = typeof t.price === "number" ? t.price : 0;
            const matchesMin = min === "" ? true : price >= Number(min);
            const matchesMax = max === "" ? true : price <= Number(max);
            const matchesQuery = q
                ? t.title?.toLowerCase().includes(q) ||
                t.description?.toLowerCase().includes(q) ||
                t.category?.toLowerCase().includes(q) ||
                t.subcategory?.toLowerCase().includes(q)
                : true;
            return matchesCat && matchesSub && matchesMin && matchesMax && matchesQuery;
        });
    }, [products, category, subcategory, min, max, query]);

    const sorted = useMemo(() => {
        const arr = [...filtered];
        if (sort === "price-asc") arr.sort((a, b) => (a.price || 0) - (b.price || 0));
        if (sort === "price-desc") arr.sort((a, b) => (b.price || 0) - (a.price || 0));
        return arr;
    }, [filtered, sort]);

    return (
        <div className="px-4 pb-12 pt-6 md:pt-8 md:grid md:grid-cols-[16rem_1fr] md:gap-8">
            {/* Se pasan las props 'open' y 'onClose' para controlar el sidebar desde aquí */}
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
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <section>
                {/* Encabezado reorganizado para funcionar bien en desktop y mobile */}
                <div className="mb-6 flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">Shop</h1>

                    {/* Controles para Desktop (se oculta en móvil) */}
                    <div className="hidden md:block">
                        <select
                            className="rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="relevance">Relevancia</option>
                            <option value="price-asc">Precio: menor a mayor</option>
                            <option value="price-desc">Precio: mayor a menor</option>
                        </select>
                    </div>

                    {/* Controles para Mobile (se oculta en desktop) */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm"
                            aria-label="Abrir filtros"
                        >
                            <FunnelIcon className="h-4 w-4" />
                            Filtros
                        </button>

                        <Disclosure as="div" className="relative">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className="inline-flex w-full items-center justify-between rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm">
                                        Relevancia
                                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                                    </DisclosureButton>
                                    <DisclosurePanel className="absolute right-0 z-10 mt-1 w-48 rounded-2xl border border-zinc-200 bg-white p-2 shadow-md">
                                        <ul className="flex flex-col gap-1">
                                            <li><button onClick={() => setSort("relevance")} className="w-full rounded-lg px-2 py-1 text-left text-sm hover:bg-zinc-100">Relevancia</button></li>
                                            <li><button onClick={() => setSort("price-asc")} className="w-full rounded-lg px-2 py-1 text-left text-sm hover:bg-zinc-100">Precio: menor a mayor</button></li>
                                            <li><button onClick={() => setSort("price-desc")} className="w-full rounded-lg px-2 py-1 text-left text-sm hover:bg-zinc-100">Precio: mayor a menor</button></li>
                                        </ul>
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : sorted.length === 0 ? (
                    <p className="text-sm text-zinc-500">No hay productos para esta combinación.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {sorted.map((item) => (
                            <GlassProductCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
