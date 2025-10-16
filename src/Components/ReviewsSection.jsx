import React, { useEffect, useState } from "react";
import { getReviews } from "../api/reviews";

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
            <div className="text-2xl font-bold text-zinc-900">{Math.round(data.promedio * 10) / 10}</div>
            <div className="text-sm text-zinc-600">de {data.reviews?.length ?? 0} reseñas</div>
          </div>

          {(!data.reviews || data.reviews.length === 0) && (
            <p className="text-zinc-600">Aún no hay reseñas para este producto.</p>
          )}

          {Array.isArray(data.reviews) && data.reviews.length > 0 && (
            <ul className="space-y-4">
              {data.reviews.map((r) => (
                <li key={r.id} className="rounded-md border p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-zinc-900">Puntuación: {r.calification}</div>
                    <div className="text-xs text-zinc-500">#{r.id}</div>
                  </div>
                  {r.description && <p className="mt-2 text-sm text-zinc-700">{r.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

