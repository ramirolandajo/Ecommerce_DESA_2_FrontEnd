// src/Sections/RelatedProductsSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { productUrl } from "../routes/paths";

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
          <Link
            key={item?.id ?? idx}
            to={productUrl(item?.id ?? "")}
            className="block rounded-xl border p-4"
          >
            <h3 className="font-medium text-zinc-900">{item?.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
