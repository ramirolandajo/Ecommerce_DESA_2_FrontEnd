import { useState } from "react";
import AddressStep from "./AddressStep.jsx";
import ShippingStep from "./ShippingStep.jsx";
import PaymentStep from "./PaymentStep.jsx";

const labels = ["Address", "Shipping", "Payment"];

export default function Stepper({ items, money, handleConfirm }) {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [shipping, setShipping] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  const canNext =
    (step === 1 && address) ||
    (step === 2 && shipping) ||
    (step === 3 && card.number && card.name && card.expiry && card.cvv);

  const next = () => {
    if (step === 3) {
      handleConfirm();
    } else {
      setStep((s) => Math.min(3, s + 1));
    }
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="space-y-6">
      <div className="text-sm font-medium">{`Step ${step}: ${labels[step - 1]}`}</div>

      {step === 1 && (
        <AddressStep address={address} setAddress={setAddress} />
      )}
      {step === 2 && (
        <ShippingStep shipping={shipping} setShipping={setShipping} />
      )}
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

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={back}
          disabled={step === 1}
          className="rounded border px-4 py-2 text-sm disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={next}
          disabled={!canNext}
          className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {step === 3 ? "Confirm" : "Next"}
        </button>
      </div>
    </div>
  );
}

