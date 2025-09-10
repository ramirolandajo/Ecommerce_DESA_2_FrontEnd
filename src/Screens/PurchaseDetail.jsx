import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import purchaseService from "../api/purchase";
import { CheckCircleIcon, XCircleIcon, TruckIcon, CalendarDaysIcon, MapPinIcon, CreditCardIcon } from "@heroicons/react/24/outline";

const statusStyles = {
  CONFIRMED: "bg-emerald-100 text-emerald-700 border-emerald-300",
  CANCELLED: "bg-red-100 text-red-700 border-red-300",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

function ProductCard({ item }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm">
      {item.product.mediaSrc?.[0] && (
        <img src={item.product.mediaSrc[0]} alt={item.product.title} className="h-16 w-16 rounded-lg object-cover border" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-900 text-lg truncate">{item.product.title}</span>
          <span className="ml-2 text-xs text-zinc-500 bg-zinc-200 rounded px-2 py-0.5">x{item.quantity}</span>
        </div>
        <div className="text-xs text-zinc-500 truncate">{item.product.description}</div>
      </div>
      <span className="font-bold text-emerald-700 text-lg">${item.product.price}</span>
    </div>
  );
}

export default function PurchaseDetail() {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPurchase() {
      setLoading(true);
      setError(null);
      try {
        const data = await purchaseService.fetchPurchase(id);
        setPurchase(data);
      } catch (err) {
        setError("No se pudo cargar la compra");
      } finally {
        setLoading(false);
      }
    }
    fetchPurchase();
  }, [id]);

  if (loading) return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100 rounded-xl" />
        {[1,2].map((i) => (
          <div key={i} className="h-16 bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100 rounded-xl" />
        ))}
      </div>
    </section>
  );
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!purchase) return <div className="p-8 text-center">Compra no encontrada</div>;

  const statusClass = statusStyles[purchase.status] || "bg-zinc-100 text-zinc-700 border-zinc-300";

  // Mostrar la dirección en varias líneas y con formato visual
  const direccion = purchase.direction || "";
  const direccionLines = direccion.split(/, ?/g);

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl shadow-lg border border-zinc-200 bg-white p-8 mb-8">
        <div className="flex flex-wrap items-center gap-4 justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCardIcon className="h-6 w-6 text-zinc-400" />
            <span className="font-bold text-2xl text-zinc-900">Compra #{purchase.id}</span>
            <span className={`px-3 py-1 rounded-full border text-sm font-semibold ${statusClass}`}>{purchase.status}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <CalendarDaysIcon className="h-5 w-5" />
            <span>{new Date(purchase.date).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 mb-4">
          <div className="flex items-center gap-2 text-zinc-700">
            <MapPinIcon className="h-5 w-5" />
            <div className="flex flex-col">
              {direccionLines.map((line, idx) => (
                <span key={idx} className="text-sm text-zinc-700 leading-tight">{line}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-700">
            <TruckIcon className="h-5 w-5" />
            <span>Envío reservado: {new Date(purchase.reservationTime).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex justify-end">
          <span className="text-2xl font-extrabold text-emerald-700">Total: ${purchase.cart?.finalPrice}</span>
        </div>
      </div>
      <h2 className="mb-4 text-xl font-bold text-zinc-900">Productos</h2>
      <div className="grid gap-4">
        {purchase.cart?.items?.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
