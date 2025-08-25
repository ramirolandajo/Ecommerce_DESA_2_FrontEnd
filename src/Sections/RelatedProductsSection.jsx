// src/Sections/RelatedProductsSection.jsx
import { useMemo } from "react";
import GlassProductCard from "../Components/GlassProductCard.jsx";
import { tiles } from "../data/Products.js";

export default function RelatedProductsSection({ category, subcategory, excludeId }) {
    const related = useMemo(() => {
        return tiles
            .filter((t) => {
                if (excludeId && String(t.id) === String(excludeId)) return false;
                const sameCategory = category && t.category === category;
                const sameSubcategory = subcategory && t.subcategory === subcategory;
                return sameCategory || sameSubcategory;
            })
            .slice(0, 4);
    }, [category, subcategory, excludeId]);

    if (related.length === 0) return null;

    return (
        <section className="mt-12 border-t border-zinc-200 pt-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                Productos relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((item) => (
                    <GlassProductCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}
