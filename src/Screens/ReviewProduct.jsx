// src/Screens/ReviewProduct.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addReview, getMyReview } from "../api/reviews";
import { productUrl } from "../routes/paths";

export default function ReviewProduct() {
  const { productCode } = useParams();
  const navigate = useNavigate();
  const [calification, setCalification] = useState(5);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      if (!productCode) {
        setChecking(false);
        return;
      }
      setChecking(true);
      try {
        const r = await getMyReview(productCode);
        if (!mounted) return;
        setExistingReview(r);
      } catch (ex) {
        console.error("Error comprobando review existente:", ex);
      } finally {
        if (mounted) setChecking(false);
      }
    }
    check();
    return () => (mounted = false);
  }, [productCode]);

  const submit = async (e) => {
    e.preventDefault();
    if (existingReview) {
      setError("Ya dejaste una reseña para este producto.");
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await addReview(productCode, { calification: Number(calification), description });
      setSuccess("Reseña enviada correctamente.");
      if (res && res.productId) {
        navigate(productUrl(res.productId));
      } else if (res && res.id) {
        // si el response incluye id de producto en otro campo
        navigate(-1);
      } else {
        setTimeout(() => navigate(-1), 1200);
      }
    } catch (ex) {
      console.error("Error enviando review:", ex);
      setError(ex.response?.data?.message || ex.message || String(ex));
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="animate-pulse h-32 bg-white rounded" />
      </div>
    );
  }

  if (existingReview) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Tu reseña</h1>
        <div className="bg-white p-6 rounded shadow">
          <div className="mb-2 text-sm text-zinc-600">Calificación: <strong>{existingReview.calification}</strong></div>
          {existingReview.description ? (
            <p className="text-zinc-800">{existingReview.description}</p>
          ) : (
            <p className="text-zinc-500 italic">Sin comentario</p>
          )}
          <p className="mt-4 text-sm text-zinc-600">Ya has dejado una reseña para este producto. Gracias.</p>
          <div className="mt-4">
            <button onClick={() => navigate(-1)} className="inline-flex items-center rounded border px-4 py-2">Volver</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">Dejar una reseña</h1>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Calificación</label>
          <select
            value={calification}
            onChange={(e) => setCalification(e.target.value)}
            className="mt-1 block w-28 border rounded px-3 py-2"
            aria-label="Calificación"
          >
            <option value={5}>5 - Excelente</option>
            <option value={4}>4 - Muy bueno</option>
            <option value={3}>3 - Bueno</option>
            <option value={2}>2 - Regular</option>
            <option value={1}>1 - Malo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">Comentario (opcional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="mt-1 block w-full border rounded px-3 py-2"
            placeholder="Comparte tu experiencia con el producto"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded bg-zinc-900 text-white px-4 py-2"
          >
            {loading ? "Enviando..." : "Enviar reseña"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded border px-4 py-2"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
