import { useMemo } from "react";
import { tiles } from "../../data/Products.js";

export default function PaymentStep({
  items,
  address,
  shipping,
  money,
  card,
  setCard,
}) {
  const productIndex = useMemo(() => {
    const map = new Map();
    tiles.forEach((t) => map.set(t.id, t));
    return map;
  }, []);

  const subtotal = items.reduce(
    (acc, i) => acc + (i.price ?? 0) * (i.quantity ?? 1),
    0
  );
  const tax = 50;
  const shippingCost = 29;
  const total = subtotal + tax + shippingCost;

  const updateCard = (field, value) => {
    setCard({ ...card, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Payment Details</h2>
        <input
          type="text"
          placeholder="Card number"
          value={card.number}
          onChange={(e) => updateCard("number", e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Name on card"
          value={card.name}
          onChange={(e) => updateCard("name", e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="MM/YY"
            value={card.expiry}
            onChange={(e) => updateCard("expiry", e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="CVV"
            value={card.cvv}
            onChange={(e) => updateCard("cvv", e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <aside className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Summary</h2>
        <ul className="space-y-4">
          {items.map((item) => {
            const p = productIndex.get(item.id);
            const img = item.image ?? p?.media?.src;
            const alt = p?.media?.alt ?? item.title;
            const title = p?.title ?? item.title;
            return (
              <li key={`${item.id}-${item.variant ?? ""}`} className="flex items-center gap-4">
                {img ? (
                  <img
                    src={img}
                    alt={alt}
                    className="h-16 w-16 rounded object-cover border"
                  />
                ) : (
                  <div className="h-16 w-16 rounded bg-zinc-100" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900">{title}</p>
                  <p className="text-xs text-zinc-500">Qty {item.quantity ?? 1}</p>
                </div>
                <div className="text-sm font-medium">{money(item.price)}</div>
              </li>
            );
          })}
        </ul>

        <div className="text-sm space-y-1 pt-2">
          <p>
            <span className="font-medium">Address: </span>
            {address}
          </p>
          <p>
            <span className="font-medium">Shipping: </span>
            {shipping}
          </p>
        </div>

        <div className="space-y-2 text-sm pt-4 border-t">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Tax</span>
            <span>{money(tax)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{money(shippingCost)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

