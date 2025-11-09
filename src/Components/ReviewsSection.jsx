import React, { useEffect, useState } from "react";
import { getReviews } from "../api/reviews";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

export default function ReviewsSection({ productId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!productId) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    getReviews(productId)
      .then((res) => {
        if (!mounted) return;
        setData(res);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Error al obtener reseñas");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [productId]);

  if (!productId) return null;
  return (
    <section className="mt-8 border-t border-zinc-200 pt-6">
      <h2 className="text-lg font-semibold text-zinc-900 mb-4">Reseñas</h2>
      {loading && <p className="text-zinc-600">Cargando reseñas…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && data && (
        <div>
          <div className="mb-3 flex items-center gap-3">
            {/* Promedio numérico con estrella */}
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-zinc-900">
                {typeof data.promedio === "number"
                  ? Math.round(data.promedio * 10) / 10
                  : 0}
              </div>
              <StarSolid className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>

            {/* Texto de conteo */}
            <div className="text-sm text-zinc-600">
              de {data.reviews?.length ?? 0} reseña
              {data.reviews?.length === 1 ? "" : "s"}
            </div>
          </div>

          {/* Visual: hasta 5 estrellas según promedio */}
          <div
            className="mb-4 flex items-center gap-1"
            aria-hidden
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const filled =
                typeof data.promedio === "number"
                  ? i < Math.round(data.promedio)
                  : false;
              return filled ? (
                <StarSolid key={i} className="h-4 w-4 text-amber-400" />
              ) : (
                <StarOutline key={i} className="h-4 w-4 text-zinc-300" />
              );
            })}
          </div>

          {(!data.reviews || data.reviews.length === 0) && (
            <p className="text-zinc-600">Aún no hay reseñas para este producto.</p>
          )}

          {Array.isArray(data.reviews) && data.reviews.length > 0 && (
            <ul className="space-y-4">
              {data.reviews.map((r) => (
                <li key={r.id} className="rounded-md border p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Estrellas visuales de la reseña */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const filled = i < Math.round(Number(r.calification) || 0);
                          return filled ? (
                            <StarSolid key={i} className="h-4 w-4 text-amber-400" />
                          ) : (
                            <StarOutline key={i} className="h-4 w-4 text-zinc-300" />
                          );
                        })}
                      </div>
                      <div className="text-sm text-zinc-600 font-medium">
                        {Number(r.calification) || 0}
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500">#{r.id}</div>
                  </div>
                  {r.description && (
                    <p className="mt-2 text-sm text-zinc-700">
                      {r.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
