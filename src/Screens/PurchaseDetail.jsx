import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import purchaseService from "../api/purchase";
import { TruckIcon, CalendarDaysIcon, MapPinIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { reviewByCodeUrl, productUrl } from "../routes/paths";
import { getMyReview } from "../api/reviews";
import { addItemIfLoggedIn } from "../store/cart/cartSlice.js";
import { showNotification } from "../store/notification/notificationSlice.js";

const statusStyles = {
  CONFIRMED: "bg-emerald-100 text-emerald-700 border-emerald-300",
  CANCELLED: "bg-red-100 text-red-700 border-red-300",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

function ProductCard({ item, isReviewed }) {
  const product = item.product || {};
  const productCode = product.productCode; // usar SOLO productCode (no fallback a id)
  return (
    <Link to={productUrl(product.id)} className="block">
      <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm hover:bg-zinc-100 transition">
        {product.mediaSrc?.[0] && (
          <img src={product.mediaSrc[0]} alt={product.title} className="h-16 w-16 rounded-lg object-cover border" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 text-lg truncate">{product.title}</span>
            <span className="ml-2 text-xs text-zinc-500 bg-zinc-200 rounded px-2 py-0.5">x{item.quantity}</span>
          </div>
          <div className="text-xs text-zinc-500 truncate">{product.description}</div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className="font-bold text-emerald-700 text-lg">{money(product.price)}</span>
          {productCode ? (
            isReviewed ? (
              <span className="inline-flex items-center rounded border px-3 py-1 text-sm bg-emerald-50 text-emerald-700">
                Reseñado
              </span>
            ) : (
              <Link
                to={reviewByCodeUrl(productCode)}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center rounded border px-3 py-1 text-sm bg-white hover:bg-zinc-50"
              >
                Dejar reseña
              </Link>
            )
          ) : (
            <button
              type="button"
              disabled
              title="No es posible dejar reseña (no hay productCode)"
              className="inline-flex items-center rounded border px-3 py-1 text-sm bg-zinc-100 text-zinc-400 cursor-not-allowed"
            >
              Dejar reseña
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function PurchaseDetail() {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewedMap, setReviewedMap] = useState({}); // productCode -> true
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const money = (n) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(n) || 0);

  useEffect(() => {
    async function fetchPurchase() {
      setLoading(true);
      setError(null);
      try {
        const data = await purchaseService.fetchPurchase(id);
        setPurchase(data);

        // después de cargar la compra, comprobar reviews del usuario para cada producto
        const items = data?.cart?.items ?? [];
        const productCodes = items
          .map((it) => it?.product?.productCode)
          .filter((c) => c != null);

        if (productCodes.length > 0) {
          // realizar checks en paralelo
          const checks = await Promise.allSettled(productCodes.map((code) => getMyReview(code)));
          const map = {};
          checks.forEach((res, idx) => {
            const code = productCodes[idx];
            if (res.status === "fulfilled" && res.value) {
              map[code] = true;
            } else {
              map[code] = false;
            }
          });
          setReviewedMap(map);
        }
      } catch (err) {
        setError("No se pudo cargar la compra: " + (err?.message || String(err)));
      } finally {
        setLoading(false);
      }
    }
    fetchPurchase();
  }, [id]);

  const repeatPurchase = async () => {
    if (!purchase?.cart?.items) return;
    let addedCount = 0;
    let failedCount = 0;
    for (const item of purchase.cart.items) {
      const product = item.product;
      if (!product) continue;
      try {
        await dispatch(addItemIfLoggedIn({
          id: String(product.id),
          title: product.title,
          price: product.price,
          quantity: item.quantity,
          image: product.mediaSrc?.[0] || "",
          stock: product.stock,
        })).unwrap();
        addedCount++;
      } catch (err) {
        failedCount++;
      }
    }
    if (addedCount > 0) {
      dispatch(showNotification({ message: `${addedCount} producto(s) agregado(s) al carrito`, type: "success" }));
    }
    if (failedCount > 0) {
      dispatch(showNotification({ message: `${failedCount} producto(s) no pudieron agregarse (stock insuficiente)`, type: "warning" }));
    }
    navigate('/cart');
  };

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
          <span className="text-2xl font-extrabold text-emerald-700">Total: {money(purchase.cart?.finalPrice)}</span>
        </div>
      </div>
      <h2 className="mb-4 text-xl font-bold text-zinc-900">Productos</h2>
      <div className="grid gap-4">
        {purchase.cart?.items?.map((item) => (
          <ProductCard key={item.id} item={item} isReviewed={!!reviewedMap[item.product?.productCode]} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <button
          onClick={repeatPurchase}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Repetir compra
        </button>
      </div>
    </section>
  );
}
