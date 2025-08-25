import { useSelector } from "react-redux";

export default function Checkout() {
  const { items, totalAmount } = useSelector((s) => s.cart);
  const money = (n) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  if (items.length === 0) {
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
      <ul className="mb-6 divide-y">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between py-2 text-sm">
            <span>
              {item.title} x {item.quantity}
            </span>
            <span>{money((item.price ?? 0) * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mb-8 text-right font-semibold">Total: {money(totalAmount)}</p>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre"
          className="w-full rounded border border-zinc-300 px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded border border-zinc-300 px-3 py-2"
        />
        <button
          type="button"
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Confirmar compra
        </button>
      </form>
    </section>
  );
}

