import { useState } from "react";
import AddressStep from "./AddressStep.jsx";
import ShippingStep from "./ShippingStep.jsx";
import PaymentStep from "./PaymentStep.jsx";
import {
  MapPinIcon,
  TruckIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const steps = [
  { id: 1, label: "Address", Icon: MapPinIcon },
  { id: 2, label: "Shipping", Icon: TruckIcon },
  { id: 3, label: "Payment", Icon: CreditCardIcon },
];

export default function Stepper({ items, money, handleConfirm }) {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");      // 'home' | 'office'
  const [shipping, setShipping] = useState("");    // 'regular' | 'express' | 'scheduled'
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const canNext =
      (step === 1 && !!address) ||
      (step === 2 && !!shipping) ||
      (step === 3 && card.number && card.name && card.expiry && card.cvv);

  const next = () => {
    if (step === 3) handleConfirm?.();
    else setStep((s) => Math.min(3, s + 1));
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  return (
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Step header con iconos */}
        <ol className="grid grid-cols-3 gap-4">
          {steps.map(({ id, label }) => {
            const active = step === id;
            const done = step > id;
            return (
                <li key={id} className="flex items-center gap-3">
                  <div
                      className={[
                        "flex h-8 w-8 items-center justify-center rounded-full border text-sm",
                        active
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : done
                                ? "border-zinc-900 text-zinc-900"
                                : "border-zinc-300 text-zinc-400",
                      ].join(" ")}
                      title={label}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                <span
                    className={[
                      "text-xs",
                      active ? "text-zinc-900" : "text-zinc-400",
                    ].join(" ")}
                >
                  Step {id}
                </span>
                    <span className="text-sm font-medium text-zinc-900">{label}</span>
                  </div>
                </li>
            );
          })}
        </ol>

        {/* Contenido de cada paso */}
        {step === 1 && <AddressStep address={address} setAddress={setAddress} />}
        {step === 2 && <ShippingStep shipping={shipping} setShipping={setShipping} />}
        {step === 3 && (
            <PaymentStep
                items={items}
                address={address}
                shipping={shipping}
                money={money}
                card={card}
                setCard={setCard}
            />
        )}

        {/* Botonera inferior */}
        <div className="flex justify-end gap-3 pt-2">
          <button
              type="button"
              onClick={back}
              disabled={step === 1}
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm text-zinc-800 shadow-sm disabled:opacity-50"
          >
            Back
          </button>
          <button
              type="button"
              onClick={next}
              disabled={!canNext}
              className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm disabled:opacity-50"
          >
            {step === 3 ? "Pay" : "Next"}
          </button>
        </div>
      </div>
  );
}
