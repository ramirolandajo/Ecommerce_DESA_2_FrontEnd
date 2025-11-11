import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import purchaseService from "../api/purchase";
import { CheckCircleIcon, XCircleIcon, TruckIcon, CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";

const statusStyles = {
  CONFIRMED: "bg-emerald-100 text-emerald-700 border-emerald-300",
  CANCELLED: "bg-red-100 text-red-700 border-red-300",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

const money = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n) || 0);

function PurchaseCard({ purchase, onClick }) {
  const status = purchase.status;
  const statusClass = statusStyles[status] || "bg-zinc-100 text-zinc-700 border-zinc-300";
  return (
    <div
      className={`group border rounded-xl shadow-sm p-5 flex flex-col gap-3 cursor-pointer transition hover:shadow-lg hover:scale-[1.01] bg-white`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-zinc-900">#{purchase.id}</span>
          <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${statusClass}`}>{status}</span>
        </div>
        <div className="flex items-center gap-1 text-zinc-500 text-sm">
          <CalendarDaysIcon className="h-4 w-4" />
          {new Date(purchase.date).toLocaleString()}
        </div>
      </div>
      <div className="flex items-center gap-2 text-zinc-700 text-sm">
        <MapPinIcon className="h-4 w-4" />
        <span>{purchase.direction}</span>
      </div>
      <div className="flex items-center gap-2 text-zinc-700 text-sm">
        <TruckIcon className="h-4 w-4" />
        <span>Envío reservado: {new Date(purchase.reservationTime).toLocaleString()}</span>
      </div>
      <div className="flex gap-2 flex-wrap pt-2">
        {purchase.cart?.items?.slice(0, 4).map((item) => (
          <div key={item.id} className="flex items-center gap-1 bg-zinc-50 rounded px-2 py-1 border border-zinc-200">
            {item.product.mediaSrc?.[0] && (
              <img src={item.product.mediaSrc[0]} alt={item.product.title} className="h-8 w-8 rounded object-cover border" />
            )}
            <span className="font-medium text-xs text-zinc-900">{item.product.title}</span>
            <span className="ml-1 text-xs text-zinc-500">x{item.quantity}</span>
          </div>
        ))}
        {purchase.cart?.items?.length > 4 && (
          <span className="text-xs text-zinc-500">+{purchase.cart.items.length - 4} más</span>
        )}
      </div>
      <div className="flex justify-end pt-2">
        <span className="text-lg font-bold text-emerald-700">{money(purchase.cart?.finalPrice)}</span>
      </div>
    </div>
  );
}

export default function UserPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPurchases() {
      setLoading(true);
      setError(null);
      try {
        const data = await purchaseService.fetchUserPurchases();
        setPurchases(data);
      } catch (err) {
        setError("No se pudo cargar el historial de compras");
      } finally {
        setLoading(false);
      }
    }
    fetchPurchases();
  }, []);

  // Ordenar por id descendente (últimas compras primero)
  const sortedPurchases = [...purchases].sort((a, b) => b.id - a.id);

  if (loading) return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="animate-pulse space-y-4">
        {[1,2,3].map((i) => (
          <div key={i} className="h-32 bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100 rounded-xl" />
        ))}
      </div>
    </section>
  );
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!purchases.length) return <div className="p-8 text-center">No tienes compras realizadas.</div>;

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-extrabold text-zinc-900 tracking-tight">Mis compras</h1>
      <div className="grid gap-8">
        {sortedPurchases.map((purchase) => (
          <PurchaseCard
            key={purchase.id}
            purchase={purchase}
            onClick={() => navigate(`/purchase/${purchase.id}`)}
          />
        ))}
      </div>
    </section>
  );
}
