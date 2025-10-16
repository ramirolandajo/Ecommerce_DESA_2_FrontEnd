import React from 'react';
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GlassProductCard from "../Components/GlassProductCard.jsx";
import FilterSidebar from "../Components/FilterSidebar.jsx";
import ProductSkeleton from "../Components/ProductSkeleton.jsx";
import { getQueryScore } from "../utils/getQueryScore.js";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon, FunnelIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { fetchFilteredProducts } from "../store/products/productsSlice";
import { useRef } from "react";
import { api } from "../api/axios";

function deriveCategories(items) {
  const map = items.reduce((map, { categories, subcategory }) => {
    const names = Array.isArray(categories)
      ? categories
          .map((c) => (typeof c === "string" ? c : c?.name))
          .filter(Boolean)
      : [];
    names.forEach((name) => {
      if (!map.has(name)) map.set(name, new Set());
      if (subcategory) map.get(name).add(subcategory);
    });
    return map;
  }, new Map());
  return Array.from(map.entries()).map(([name, subs]) => ({ name, subs: Array.from(subs) }));
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get("category");
  const initialCat = !catParam || catParam === "Todas" ? "All" : catParam;
  const query = searchParams.get("query")?.toLowerCase() || "";
  const rawMin = searchParams.get("min");
  const rawMax = searchParams.get("max");
  const subParam = searchParams.get("subcategory");
  const brandParam = searchParams.get("brand") || "";

  // Si la categoría es "All" (o ausente), no heredar subcategory de la URL
  const initialSub = initialCat === "All" ? "" : (subParam ?? "");
  const initialMin = rawMin ?? "";
  const initialMax = rawMax ?? "";

  const [category, setCategory] = useState(initialCat);
  const [subcategory, setSubcategory] = useState(initialSub);
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);
  const [brand, setBrand] = useState(brandParam);
  const [sort, setSort] = useState("relevance");

  const { items: products, status, error } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const pagination = useSelector(state => state.products.pagination);
  const [isLoading, setIsLoading] = useState(false);
  const categories = useMemo(() => deriveCategories(products), [products]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const endRef = useRef(null);
  const observerRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [serverCategories, setServerCategories] = useState([]);

  const sortLabels = {
    relevance: "Relevancia",
    "price-asc": "Precio: menor a mayor",
    "price-desc": "Precio: mayor a menor",
  };

  // Cargar categorías desde el servidor para resolver categoryCode
  useEffect(() => {
    let mounted = true;
    api.get("/categories")
      .then(res => {
        if (!mounted) return;
        const data = res.data;
        if (Array.isArray(data)) setServerCategories(data);
        else if (Array.isArray(data.content)) setServerCategories(data.content);
        else setServerCategories([]);
      })
      .catch(() => { if (mounted) setServerCategories([]); });
    return () => { mounted = false; };
  }, []);

  // Sanear estado inicial de precios si vienen negativos por URL
  useEffect(() => {
    if (min !== "" && Number(min) < 0) setMin("0");
    if (max !== "" && Number(max) < 0) setMax("0");
    // Solo al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      // category/subcategory
      if (category === "All" || category === "") params.delete("category");
      else params.set("category", category);
      if (subcategory) params.set("subcategory", subcategory);
      else params.delete("subcategory");
      return params;
    });
  }, [category, subcategory, setSearchParams]);

  // Sincronizar min/max con URL y evitar negativos en la URL
  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      const minNum = min === "" ? "" : Math.max(0, Number(min));
      const maxNum = max === "" ? "" : Math.max(0, Number(max));

      if (min === "" || Number.isNaN(Number(min)) || minNum === "") params.delete("min");
      else params.set("min", String(minNum));

      if (max === "" || Number.isNaN(Number(max)) || maxNum === "") params.delete("max");
      else params.set("max", String(maxNum));

      return params;
    });
  }, [min, max, setSearchParams]);

  // Sincronizar brand con URL
  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (!brand) params.delete("brand");
      else params.set("brand", String(brand));
      return params;
    });
  }, [brand, setSearchParams]);

  // Helper para resolver categoryCode desde serverCategories
  const resolveCategoryCode = (categoryName) => {
    if (!categoryName || categoryName === "All") return null;
    const found = serverCategories.find((c) => (c.name || String(c)).toLowerCase() === categoryName.toLowerCase());
    return found?.categoryCode ?? found?.id ?? null;
  };

  // Función para (re)cargar productos filtrados desde el servidor
  const loadFiltered = ({ page = 0 } = {}) => {
    const pageSize = pagination?.size ?? 24;
    const minNum = min === "" ? null : Math.max(0, Number(min));
    const maxNum = max === "" ? null : Math.max(0, Number(max));
    const categoryCode = resolveCategoryCode(category);

    let sortBy = null;
    let sortOrder = null;
    if (sort === "price-asc") {
      sortBy = "price";
      sortOrder = "asc";
    } else if (sort === "price-desc") {
      sortBy = "price";
      sortOrder = "desc";
    } else if (sort === "relevance") {
      sortBy = "relevance";
      sortOrder = "desc";
    }

    dispatch(fetchFilteredProducts({
      page,
      size: pageSize,
      priceMin: minNum,
      priceMax: maxNum,
      brandCode: brand || null,
      categoryCode: categoryCode || null,
      sortBy,
      sortOrder,
    }));
  };

  // Al montar, cargar la primera página con los filtros iniciales
  useEffect(() => {
    loadFiltered({ page: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverCategories]);

  // Cuando cambian los filtros/orden, recargar desde la página 0
  useEffect(() => {
    // resetear a página 0
    loadFiltered({ page: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, subcategory, min, max, brand, sort]);

  // Filtrado mejorado: solo filtrar si los productos están cargados
  const filtered = useMemo(() => {
    if (status !== "succeeded") return [];
    const q = query.trim();
    const minNum = min === "" ? null : Math.max(0, Number(min));
    const maxNum = max === "" ? null : Math.max(0, Number(max));
    const withinRange = (price) => {
      const p = typeof price === "number" ? price : 0;
      const gteMin = minNum == null ? true : p >= minNum;
      const lteMax = maxNum == null ? true : p <= maxNum;
      return gteMin && lteMax;
    };
    const isAll = category === "All" || category === "";
    if (!q) {
      return products.filter((t) => {
        const matchesCat = isAll ? true : t.categories?.some((c) => (c?.name ?? c) === category);
        const matchesSub = subcategory ? t.subcategory === subcategory : true;
        return matchesCat && matchesSub && withinRange(t.price);
      });
    }
    return products
      .map((t) => ({ ...t, score: getQueryScore(t, q) }))
      .filter((t) => {
        const matchesCat = isAll ? true : t.categories?.some((c) => (c?.name ?? c) === category);
        const matchesSub = subcategory ? t.subcategory === subcategory : true;
        return matchesCat && matchesSub && withinRange(t.price) && t.score > 0;
      });
  }, [products, category, subcategory, min, max, query, status]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "price-asc") {
      arr.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "price-desc") {
      arr.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (query) {
      // Relevancia solo si hay consulta
      arr.sort((a, b) => (b.score || 0) - (a.score || 0));
    }
    return arr;
  }, [filtered, sort, query]);

  // Mini shimmer al cambiar filtros/orden
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, [category, subcategory, min, max, sort, query]);

  // Mostrar loader también en estado idle (antes de que el hook dispare la carga)
  const showLoading = status === "loading" || status === "idle" || isLoading;

  const hasMore = pagination.page + 1 < pagination.totalPages;

  return (
    <div className="px-4 pb-12 pt-6 md:pt-8 md:grid md:grid-cols-[16rem_1fr] md:gap-8">
      <FilterSidebar
        categories={categories}
        category={category}
        subcategory={subcategory}
        min={min}
        max={max}
        brand={brand}
        onCategory={(val) => {
          setCategory(val);
          setSubcategory("");
        }}
        onSubcategory={setSubcategory}
        onMin={setMin}
        onMax={setMax}
        onBrand={setBrand}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <section>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Tienda</h1>

          {/* Desktop controls */}
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

          {/* Mobile controls */}
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
                    {sortLabels[sort]}
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                  </DisclosureButton>
                  <DisclosurePanel className="absolute right-0 z-10 mt-1 w-48 rounded-2xl border border-zinc-200 bg-white p-2 shadow-md">
                    <ul className="flex flex-col gap-1">
                      <li>
                        <button onClick={() => setSort("relevance")} className="w-full rounded-lg px-2 py-1 text-left text-sm hover:bg-zinc-100">
                          Relevancia
                        </button>
                      </li>
                      <li>
                        <button onClick={() => setSort("price-asc")} className="w-full rounded-lg px-2 py-1 text-left text-sm hover:bg-zinc-100">
                          Precio: menor a mayor
                        </button>
                      </li>
                      <li>
                        <button onClick={() => setSort("price-desc")} className="w-full rounded-lg px-2 py-1 text-left text-sm hover:bg-zinc-100">
                          Precio: mayor a menor
                        </button>
                      </li>
                    </ul>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        </div>

        {showLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : status === "failed" ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : sorted.length === 0 ? (
          <p className="text-sm text-zinc-500">No hay productos para esta combinación.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sorted.map((item) => (
                <GlassProductCard key={item.id} item={item} />
              ))}
            </div>
            {/* Paginador */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => loadFiltered({ page: Math.max(0, pagination.page - 1) })}
                  disabled={pagination.page === 0 || status === "loading"}
                  className="p-2 rounded border border-zinc-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50"
                  aria-label="Página anterior"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => loadFiltered({ page: i })}
                    disabled={status === "loading"}
                    className={`px-3 py-2 rounded border ${
                      pagination.page === i
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-zinc-300 bg-white hover:bg-zinc-50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => loadFiltered({ page: Math.min(pagination.totalPages - 1, pagination.page + 1) })}
                  disabled={pagination.page === pagination.totalPages - 1 || status === "loading"}
                  className="p-2 rounded border border-zinc-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50"
                  aria-label="Página siguiente"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
