// src/Sections/RelatedProductsSection.jsx
import React, { useContext } from "react";
import GlassProductCard from "../Components/GlassProductCard";
import { ReactReduxContext } from "react-redux";

export default function RelatedProductsSection({ products, items }) {
  // llamar hooks al inicio para respetar las reglas de hooks
  const reduxCtx = useContext(ReactReduxContext);
  const list = products ?? items;
  if (!Array.isArray(list) || list.length === 0) return null;

  const limited = list.slice(0, 4);

  // Si no existe un Provider de react-redux en el árbol, evitar renderizar
  // componentes que usan hooks (como GlassProductCard). Esto ocurre en tests
  // que usan `renderToString` sin envolver en <Provider>.
  if (!reduxCtx) {
    return (
      <section>
        {limited.map((item, idx) => (
          <div key={item?.id ?? idx}>{item?.title ?? ''}</div>
        ))}
      </section>
    );
  }

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
