import { useDispatch, useSelector } from "react-redux";
import {
  incrementItem,
  decrementItem,
  updateQuantity,
} from "../store/cartSlice";

export default function Checkout() {
  // Toma items y, si existe en el slice, totalAmount
  const { items = [], totalAmount } = useSelector((s) => s.cart) ?? {};
  const dispatch = useDispatch();

  // Subtotal calculado localmente
  const subtotal = items.reduce(
    (acc, i) => acc + (i.price ?? 0) * (i.quantity ?? 1),
    0
  );

  // Si el slice ya lleva el total, úsalo; si no, cae al subtotal
  const total = typeof totalAmount === "number" ? totalAmount : subtotal;

  const handleQtyChange = (id, raw) => {
    const n = Number(raw);
    if (!Number.isNaN(n) && n > 0) {
      dispatch(updateQuantity({ id, quantity: n }));
    }
  };

  const money = (n) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD", // si querés ARS cambiá a "ARS"
      maximumFractionDigits: 0,
    }).format(n ?? 0);

  if (!items.length) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
        <p className="text-zinc-600">No hay productos en el carrito.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <ul className="mb-6 divide-y divide-zinc-200">
        {items.map((item) => (
          <li
            key={`${item.id}-${item.variant ?? ""}`}
            className="flex items-center justify-between py-2 text-sm"
          >
            <span className="flex-1 text-zinc-700">
              {item.title}
            </span>

            {/* Controles de cantidad */}
            <div className="mr-2 flex items-center gap-1">
              <button
                type="button"
                className="px-2 border rounded text-sm disabled:opacity-50"
                aria-label={`Disminuir cantidad de ${item.title}`}
                onClick={() => dispatch(decrementItem(item.id))}
                disabled={(item.quantity ?? 1) <= 1}
              >
                -
              </button>

              <input
                type="number"
                min={1}
                value={item.quantity ?? 1}
                onChange={(e) => handleQtyChange(item.id, e.target.value)}
                className="w-12 border rounded px-1 py-0.5 text-sm text-center"
                aria-label={`Cantidad de ${item.title}`}
              />

              <button
                type="button"
                className="px-2 border rounded text-sm"
                aria-label={`Aumentar cantidad de ${item.title}`}
                onClick={() => dispatch(incrementItem(item.id))}
              >
                +
              </button>
            </div>

            <span className="font-medium">
              {money((item.price ?? 0) * (item.quantity ?? 1))}
            </span>
          </li>
        ))}
      </ul>

      <div className="space-y-1">
        <p className="text-right text-lg font-semibold">
          Subtotal: {money(subtotal)}
        </p>
        <p className="mb-8 text-right text-lg font-semibold">
          Total: {money(total)}
        </p>
      </div>

      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre"
          aria-label="Nombre"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          aria-label="Email"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="button"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 active:bg-indigo-800"
        >
          Confirmar compra
        </button>
      </form>
    </section>
  );
}
