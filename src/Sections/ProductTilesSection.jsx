// src/sections/ProductTilesSection.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GlassProductCard from "../Components/GlassProductCard.jsx";
import { tiles } from "../data/Products.js";
import { CATEGORY_ICON } from "../data/categoryIcons.js";

const TABS = [
    { key: "new", label: "New Arrival" },
    { key: "bestseller", label: "Bestseller" },
    { key: "featured", label: "Featured Products" },
];


export default function ProductTilesSection() {
    const [activeTab, setActiveTab] = useState("new");

    // categorías dinámicas (ordenadas como en el mock)
    const categories = useMemo(() => {
        const set = new Set(["All"]);
        tiles.forEach((t) => t?.category && set.add(t.category));
        const order = [
            "All",
            "Phones",
            "Smart Watches",
            "Cameras",
            "Headphones",
            "Computers",
            "Gaming",
        ];
        const result = Array.from(set);
        return result.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    }, []);

    const filtered = useMemo(() => {
        return tiles.filter((t) => {
            const flagsPresent =
                "isNew" in t || "isBestseller" in t || "isFeatured" in t;
            const byTab =
                activeTab === "new"
                    ? !!t.isNew
                    : activeTab === "bestseller"
                        ? !!t.isBestseller
                        : !!t.isFeatured;
            const fallback = activeTab === "new" && !flagsPresent;
            return byTab || fallback;
        });
    }, [activeTab]);

    return (
        <section className="relative py-10 sm:py-12 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Browse by Category */}
                <div className="mb-6 sm:mb-8 text-center">
                    <h3 className="mb-3 text-base sm:text-lg font-semibold text-zinc-900">
                        Browse By Category
                    </h3>

                    <div className="overflow-x-auto flex gap-3">
                        {categories.map((cat) => {
                              const Icon = CATEGORY_ICON[cat] ?? CATEGORY_ICON.All;
                            return (
                                <Link
                                    key={cat}
                                    to={`/shop?category=${encodeURIComponent(cat)}`}
                                    className="inline-flex items-center gap-2 rounded-2xl border px-6 py-4 text-base whitespace-nowrap transition bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
                                >
                                    <Icon className="size-5" aria-hidden="true" />
                                    <span>{cat}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Tabs */}
                <header className="mb-6 sm:mb-8">
                    <nav className="flex justify-center gap-8 text-sm font-medium text-zinc-500">
                        {TABS.map((t) => {
                            const active = activeTab === t.key;
                            return (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key)}
                                    className={[
                                        "relative pb-2 transition-colors",
                                        active ? "text-zinc-900" : "hover:text-zinc-700",
                                    ].join(" ")}
                                >
                                    {t.label}
                                    <span
                                        className={[
                                            "absolute left-0 -bottom-[2px] h-[2px] w-full rounded",
                                            active ? "bg-zinc-900" : "bg-transparent",
                                        ].join(" ")}
                                    />
                                </button>
                            );
                        })}
                    </nav>
                </header>

                {/* Grid de productos */}
                {filtered.length === 0 ? (
                    <p className="text-sm text-zinc-500 text-center">
                        No hay productos para esta combinación.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((item) => (
                            <GlassProductCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
