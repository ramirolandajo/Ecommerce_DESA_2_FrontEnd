const options = [
  { value: "store", label: "Retiro en tienda" },
  { value: "regular", label: "Envío regular" },
  { value: "scheduled", label: "Envío programado" },
];

export default function ShippingStep({ shipping, setShipping }) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Shipping Method</h2>
      <ul className="space-y-2">
        {options.map((opt) => (
          <li key={opt.value} className="flex items-center gap-2">
            <input
              type="radio"
              name="shipping"
              value={opt.value}
              checked={shipping === opt.value}
              onChange={() => setShipping(opt.value)}
              className="h-4 w-4"
            />
            <span>{opt.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

