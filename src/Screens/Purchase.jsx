import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Purchase() {
  const { state } = useLocation();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!state?.id) return;
    fetch(`/purchase/${state.id}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => setDetails(data))
      .catch(() => {});
  }, [state?.id]);

  if (!state) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-4 text-3xl font-bold">Compra pendiente</h1>
        <p className="text-zinc-600">No hay información de la compra.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">{`Compra #${state.id} confirmada`}</h1>
      {details ? (
        <pre className="rounded bg-zinc-100 p-4 text-sm text-zinc-700">
          {JSON.stringify(details, null, 2)}
        </pre>
      ) : (
        <pre className="rounded bg-zinc-100 p-4 text-sm text-zinc-700">
          {JSON.stringify(state, null, 2)}
        </pre>
      )}
    </section>
  );
}
