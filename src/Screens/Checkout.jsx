import { useSelector } from "react-redux";

export default function Checkout() {
  const { items = [], totalAmount = 0 } = useSelector((s) => s.cart) ?? {};
  const subtotal = items.reduce(
    (acc, i) => acc + (i.price ?? 0) * (i.quantity ?? 1),
    0,
  );

  const money = (n) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
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
        {items.map((item) => {
          const itemSubtotal = (item.price ?? 0) * (item.quantity ?? 1);
          return (
            <li
              key={`${item.id}-${item.variant ?? ""}`}
              className="flex justify-between py-2 text-sm"
            >
              <span className="text-zinc-700">
                {item.title} <span className="text-zinc-500">x {item.quantity}</span>
              </span>
              <span className="font-medium">{money(itemSubtotal)}</span>
            </li>
          );
        })}
      </ul>

      <p className="mb-2 text-right text-lg font-semibold">
        Subtotal: {money(subtotal)}
      </p>
      <p className="mb-8 text-right text-lg font-semibold">
        Total: {money(totalAmount)}
      </p>

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
