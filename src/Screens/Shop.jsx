import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { tiles, categories } from "../data/Products.js";
import GlassProductCard from "../Components/GlassProductCard.jsx";
import FilterSidebar from "../Components/FilterSidebar.jsx";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";
  const initialMin = searchParams.get("min") ?? "";
  const initialMax = searchParams.get("max") ?? "";

  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] = useState("");
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);
  const [sort, setSort] = useState("relevance");

  const filtered = useMemo(() => {
    const q = query.trim();
    return tiles.filter((t) => {
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
      return (
        matchesCat && matchesSub && matchesMin && matchesMax && matchesQuery
      );
    });
  }, [category, subcategory, min, max, query]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "price-asc") arr.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "price-desc") arr.sort((a, b) => (b.price || 0) - (a.price || 0));
    return arr;
  }, [filtered, sort]);

  return (
    <div className="md:flex">
      {/* Sidebar: en md+ es fixed y no empuja el flujo */}
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

      {/* Contenido: reservamos 16rem para el sidebar en md+ */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:ml-64">
        <h1 className="mb-6 text-2xl font-bold">Shop</h1>

        <div className="mb-6 flex justify-end">
          {/* Orden en desktop */}
          <select
            className="hidden md:block rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="relevance">Relevancia</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>

          {/* Orden en mobile */}
          <Disclosure as="div" className="w-full md:hidden">
            {({ open }) => (
              <div className="relative ml-auto">
                <DisclosureButton className="inline-flex w-full max-w-xs items-center justify-between rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700">
                  Ordenar
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </DisclosureButton>
                <DisclosurePanel className="absolute right-0 mt-1 w-48 rounded border border-zinc-300 bg-white p-2 shadow-md">
                  <ul className="flex flex-col gap-1">
                    <li>
                      <button
                        type="button"
                        onClick={() => setSort("relevance")}
                        className="w-full rounded px-2 py-1 text-left text-sm hover:bg-zinc-100"
                      >
                        Relevancia
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setSort("price-asc")}
                        className="w-full rounded px-2 py-1 text-left text-sm hover:bg-zinc-100"
                      >
                        Precio: menor a mayor
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setSort("price-desc")}
                        className="w-full rounded px-2 py-1 text-left text-sm hover:bg-zinc-100"
                      >
                        Precio: mayor a menor
                      </button>
                    </li>
                  </ul>
                </DisclosurePanel>
              </div>
            )}
          </Disclosure>
        </div>

        {sorted.length === 0 ? (
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
