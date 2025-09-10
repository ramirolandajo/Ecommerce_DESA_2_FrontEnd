import { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";

/* ====== detección de marca ====== */
const BRANDS = [
  { id: "amex", name: "American Express", match: (v) => /^3[47]/.test(v), mask: [4, 6, 5], total: 15, cvv: 4 },
  { id: "master", name: "Mastercard", match: (v) => /^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(v), mask: [4, 4, 4, 4], total: 16, cvv: 3 },
  { id: "visa", name: "Visa", match: (v) => /^4/.test(v), mask: [4, 4, 4, 4], total: 16, cvv: 3 },
];
const detectBrand = (raw) => BRANDS.find((b) => b.match(raw.replace(/\D/g, ""))) ?? null;
const formatNumber = (raw, brand) => {
  const v = raw.replace(/\D/g, "");
  const groups = brand?.mask ?? [4, 4, 4, 4];
  let i = 0;
  const out = [];
  for (const g of groups) {
    if (i >= v.length) break;
    out.push(v.slice(i, i + g));
    i += g;
  }
  return out.join(" ");
};
const clampLen = (raw, brand) => raw.replace(/\D/g, "").slice(0, brand?.total ?? 19);

/* ====== tarjeta con flip ====== */
function CardPreview({ number, name, expiry, brand, showBack }) {
  const printed = formatNumber(number || "", brand || detectBrand(number || ""));
  return (
    <div className="relative [perspective:1000px]">
      <div className={`relative h-44 w-full rounded-xl shadow-lg transition-transform duration-500 [transform-style:preserve-3d] ${showBack ? "rotate-y-180" : ""}`}>
        {/* Frente */}
        <div className="absolute inset-0 rounded-xl bg-zinc-900 text-white p-5 [backface-visibility:hidden]">
          <div className="text-xs opacity-60">{brand?.name || "Tarjeta"}</div>
          <div className="mt-6 text-lg tracking-widest font-medium">{printed || "•••• •••• •••• ••••"}</div>
          <div className="mt-6 flex items-center justify-between text-xs">
            <div>
              <div className="opacity-60">Titular</div>
              <div className="font-medium">{name || "—"}</div>
            </div>
            <div>
              <div className="opacity-60">F. Exp.</div>
              <div className="font-medium">{expiry || "MM/YY"}</div>
            </div>
          </div>
          <div className="absolute bottom-3 right-4 text-[10px] opacity-60">{brand?.id?.toUpperCase() ?? ""}</div>
        </div>
        {/* Dorso */}
        <div className="absolute inset-0 rounded-xl bg-zinc-800 text-white p-5 rotate-y-180 [backface-visibility:hidden]">
          <div className="h-6 w-full bg-zinc-700" />
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1">
              <div className="h-8 w-full rounded bg-white/90" />
            </div>
            <div className="w-16 rounded bg-white/90 text-right text-zinc-900 px-2 py-1 text-sm font-semibold">CVV</div>
          </div>
          <div className="absolute bottom-3 right-4 text-[10px] opacity-60">{brand?.id?.toUpperCase() ?? ""}</div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentStep({ items, address, shipping, money, card, setCard }) {
  const { items: products } = useSelector((s) => s.products);

  const pm = useMemo(() => {
    const m = new Map();
    products.forEach((p) => m.set(p.id, p));
    return m;
  }, [products]);

  const subtotal = items.reduce((a, i) => a + (i.price ?? 0) * (i.quantity ?? 1), 0);
  const tax = 50;
  const shippingCost = shipping === "express" ? 8.5 : 29;
  const total = subtotal + tax + shippingCost;

  /* ===== estado del form sin botón “siguiente” ===== */
  const [method, setMethod] = useState("card");
  const [step, setStep] = useState(0); // 0:number 1:name 2:expiry 3:cvv
  const brand = detectBrand(card.number || "");
  const cvvLen = brand?.cvv ?? 3;
  const digitsTarget = brand?.total ?? 19;
  const showBack = step === 3;

  // autofocus del campo activo
  useEffect(() => {
    const id = ["cc-number", "cc-name", "cc-expiry", "cc-cvv"][step];
    document.getElementById(id)?.focus();
  }, [step]);

  const update = (k, v) => setCard({ ...card, [k]: v });

  // número → avanza solo al completar los dígitos de la marca
  const onNumber = (v) => {
    const next = clampLen(v, brand);
    update("number", next);
    const done = next.replace(/\D/g, "").length >= digitsTarget;
    if (done) setStep(1);
  };

  // nombre → avanza al tener al menos 3 letras (o Enter)
  const onName = (v) => {
    const up = v.toUpperCase();
    update("name", up);
    if (up.trim().length > 2) setStep(2);
  };

  // expiry → formato MM/YY y avanza al validar regex
  const onExpiry = (v) => {
    const raw = v.replace(/\D/g, "").slice(0, 4);
    const mm = raw.slice(0, 2);
    const yy = raw.slice(2, 4);
    const show = mm && yy ? `${mm}/${yy}` : mm;
    update("expiry", show);
    if (/^(0[1-9]|1[0-2])\/\d{2}$/.test(show)) setStep(3);
  };

  // cvv → limita largo y no avanza (es el último). Flip al focusear.
  const onCvv = (v) => update("cvv", v.replace(/\D/g, "").slice(0, cvvLen));

  // autocompletar
  const fill = (which) => {
    const presets = {
      visa: { number: "4111 1111 1111 1111", name: "JOHN DOE", expiry: "12/28", cvv: "123" },
      master: { number: "5555 5555 5555 4444", name: "JANE ROE", expiry: "10/27", cvv: "123" },
      amex: { number: "3782 822463 10005", name: "ALICE AMEX", expiry: "09/26", cvv: "1234" },
    };
    const p = presets[which] ?? presets.visa;
    setCard(p);
    setStep(3);
  };

  const completeNumber = (card.number || "").replace(/\D/g, "").length >= digitsTarget;
  const nameOk = (card.name || "").trim().length > 2;
  const expiryOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry || "");
  const cvvOk = (card.cvv || "").length >= cvvLen;
  const isCardValid = completeNumber && nameOk && expiryOk && cvvOk;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* ===== Summary ===== */}
      <aside className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-zinc-900">Resumen</h3>
        <ul className="mt-4 space-y-3">
          {items.map((i) => {
            const p = pm.get(i.id);
            const img = i.image ?? p?.media?.src;
            const title = p?.title ?? i.title;
            const price = (i.price ?? 0) * (i.quantity ?? 1);
            return (
              <li key={`${i.id}-${i.variant ?? ""}`} className="flex items-center gap-3 rounded-lg bg-zinc-50 p-2">
                {img ? (
                  <img src={img} alt={title} className="h-10 w-10 rounded-md object-cover border border-zinc-200" />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-zinc-200" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900">{title}</p>
                  <p className="text-xs text-zinc-500">Cant. {i.quantity ?? 1}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-900 border border-zinc-200">
                  {money(price)}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 space-y-1 text-sm">
          <p className="text-zinc-500">Dirección</p>
          <p className="font-medium text-zinc-900">
            {address === "home"
              ? "2118 Thornridge Cir, Syracuse, CT 35624"
              : address === "office"
              ? "2715 Ash Dr. San Jose, SD 83475"
              : "—"}
          </p>
        </div>

        <div className="mt-2 space-y-1 text-sm">
          <p className="text-zinc-500">Método de envío</p>
          <p className="font-medium text-zinc-900 capitalize">{shipping || "—"}</p>
        </div>

        <div className="mt-4 border-t pt-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Impuestos estimados</span>
            <span>{money(tax)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío y manejo estimados</span>
            <span>{money(shippingCost)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </div>
      </aside>

      {/* ===== Pago ===== */}
      <div className="space-y-4">
        <div className="flex gap-2">
          {["card", "paypal", "ppc"].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setMethod(id)}
              className={`rounded-md px-3 py-2 text-sm border ${method === id ? "border-zinc-900 bg-white font-medium" : "border-zinc-200 bg-zinc-50 text-zinc-600"}`}
            >
              {id === "card" ? "Tarjeta de crédito" : id === "paypal" ? "PayPal" : "Crédito PayPal"}
            </button>
          ))}
        </div>

        {method === "card" ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm space-y-5">
            <CardPreview number={card.number} name={card.name} expiry={card.expiry} brand={brand} showBack={showBack} />

            {/* Campos que avanzan solos */}
            <div className="pt-2 space-y-3">
              {/* Número */}
              <div className={`transition-opacity ${step > 0 ? "opacity-50" : "opacity-100"}`}>
                <label className="mb-1 block text-xs text-zinc-600">Número de tarjeta {brand ? `· ${brand.name}` : ""}</label>
                <input
                  id="cc-number"
                  type="text"
                  inputMode="numeric"
                  placeholder="•••• •••• •••• ••••"
                  value={formatNumber(card.number || "", brand)}
                  onChange={(e) => onNumber(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && completeNumber && setStep(1)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <div className="mt-1 text-[11px] text-zinc-500">{brand ? `${brand.total} dígitos • CVV ${cvvLen}` : "Visa / Mastercard / AmEx"}</div>
              </div>

              {/* Nombre */}
              <div className={`transition-opacity ${step > 1 ? "opacity-50" : step === 1 ? "opacity-100" : "opacity-50"}`}>
                <label className="mb-1 block text-xs text-zinc-600">Nombre del titular</label>
                <input
                  id="cc-name"
                  type="text"
                  placeholder="NOMBRE APELLIDO"
                  value={card.name || ""}
                  onChange={(e) => onName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (card.name || "").trim().length > 2 && setStep(2)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Expiración */}
              <div className={`transition-opacity ${step === 2 ? "opacity-100" : "opacity-50"}`}>
                <label className="mb-1 block text-xs text-zinc-600">Fecha de exp.</label>
                <input
                  id="cc-expiry"
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/YY"
                  value={card.expiry || ""}
                  onChange={(e) => onExpiry(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry || "") && setStep(3)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>

              {/* CVV */}
              <div className={`transition-opacity ${step === 3 ? "opacity-100" : "opacity-50"}`}>
                <label className="mb-1 block text-xs text-zinc-600">{brand?.id === "amex" ? "CID (4 dígitos)" : "CVV"}</label>
                <input
                  id="cc-cvv"
                  type="text"
                  inputMode="numeric"
                  placeholder={brand?.id === "amex" ? "1234" : "123"}
                  value={(card.cvv || "").replace(/\D/g, "").slice(0, cvvLen)}
                  onFocus={() => setStep(3)}
                  onChange={(e) => onCvv(e.target.value)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <div className="mt-1 text-[11px] text-zinc-500">{cvvLen} dígitos</div>
              </div>

              {/* Autocompletar para pruebas */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button type="button" onClick={() => fill("visa")} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs">
                  Autocompletar VISA
                </button>
                <button type="button" onClick={() => fill("master")} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs">
                  Autocompletar MASTERCARD
                </button>
                <button type="button" onClick={() => fill("amex")} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs">
                  Autocompletar AMEX
                </button>
              </div>

              {/* Estado de validación */}
              <div className="pt-1 text-[11px]">
                <span className={`mr-2 ${completeNumber ? "text-emerald-600" : "text-zinc-500"}`}>Número ✓</span>
                <span className={`mr-2 ${nameOk ? "text-emerald-600" : "text-zinc-500"}`}>Nombre ✓</span>
                <span className={`mr-2 ${expiryOk ? "text-emerald-600" : "text-zinc-500"}`}>Fecha ✓</span>
                <span className={`${cvvOk ? "text-emerald-600" : "text-zinc-500"}`}>CVV ✓</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            Elegiste {method === "paypal" ? "PayPal" : "Crédito PayPal"}. En producción te redirigiría al proveedor.
          </div>
        )}

        {/* TIP: podés usar isCardValid para habilitar el botón Pay del Stepper */}
        <input type="hidden" value={isCardValid ? "ok" : ""} readOnly />
      </div>
    </div>
  );
}
