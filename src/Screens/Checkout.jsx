import { useSelector } from "react-redux";
import Stepper from "../Components/Checkout/Stepper.jsx";
import { createPreference } from "../utils/mercadoPago.js";

export default function Checkout() {
  const { items = [] } = useSelector((s) => s.cart) ?? {};

  const money = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n ?? 0);

  const handleConfirm = async () => {
    new window.MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);
    const initPoint = await createPreference(items);
    window.location.href = initPoint;
  };

  if (!items.length) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-4 text-3xl font-bold">Checkout</h1>
        <p className="text-zinc-600">No hay productos en el carrito.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <Stepper items={items} money={money} handleConfirm={handleConfirm} />
    </section>
  );
}

