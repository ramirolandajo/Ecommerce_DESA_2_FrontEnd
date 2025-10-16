// src/Sections/RelatedProductsSection.jsx
import React from "react";
import GlassProductCard from "../Components/GlassProductCard";

export default function RelatedProductsSection({ products, items }) {
  const list = products ?? items;
  if (!Array.isArray(list) || list.length === 0) return null;

  const limited = list.slice(0, 4);

  return (
    <section className="mt-12 border-t border-zinc-200 pt-6">
      <h2 className="text-lg font-semibold text-zinc-900 mb-4">
        Productos relacionados
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {limited.map((item, idx) => (
          <div key={item?.id ?? idx} className="h-full">
            <GlassProductCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
