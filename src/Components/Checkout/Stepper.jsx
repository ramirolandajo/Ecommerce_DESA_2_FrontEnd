import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cancelPurchase } from "../../store/purchase/purchaseSlice.js";
import AddressStep from "./AddressStep.jsx";
import ShippingStep from "./ShippingStep.jsx";
import PaymentStep from "./PaymentStep.jsx";
import {
  MapPinIcon,
  TruckIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const steps = [
  { id: 1, label: "Dirección", Icon: MapPinIcon },
  { id: 2, label: "Envío", Icon: TruckIcon },
  { id: 3, label: "Pago", Icon: CreditCardIcon },
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

  const dispatch = useDispatch();
  const { id: purchaseId, timeLeft = 0 } = useSelector((s) => s.purchase ?? {});
  const totalTimeRef = useRef(timeLeft);
  useEffect(() => {
    totalTimeRef.current = timeLeft;
  }, [purchaseId]);

  useEffect(() => {
    console.log("Stepper state", { purchaseId, timeLeft });
  }, [purchaseId, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const aboutToExpire = timeLeft > 0 && timeLeft <= 60;
  const expired = timeLeft <= 0;

  useEffect(() => {
    if (expired && purchaseId) {
      dispatch(cancelPurchase());
    }
  }, [expired, purchaseId, dispatch]);

  const canNext =
      (step === 1 && !!address) ||
      (step === 2 && !!shipping) ||
      (step === 3 && card.number && card.name && card.expiry && card.cvv);

  const next = () => {
    if (step === 3) {
      console.log("next called on final step", step);
      handleConfirm?.(address);
    } else {
      setStep((s) => {
        const newStep = Math.min(3, s + 1);
        console.log("next", { from: s, to: newStep });
        return newStep;
      });
    }
  };
  const back = () =>
    setStep((s) => {
      const newStep = Math.max(1, s - 1);
      console.log("back", { from: s, to: newStep });
      return newStep;
    });

  return (
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Step header con iconos */}
        <div className="flex items-center justify-between">
          <ol className="grid grid-cols-3 gap-4 flex-1">
              {steps.map((s) => {
              const active = step === s.id;
              const done = step > s.id;
              return (
                  <li key={s.id} className="flex items-center gap-3">
                  <div
                      className={[
                        "flex h-8 w-8 items-center justify-center rounded-full border text-sm",
                        active
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : done
                                ? "border-zinc-900 text-zinc-900"
                                : "border-zinc-300 text-zinc-400",
                      ].join(" ")}
                        title={s.label}
                  >
                        <s.Icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                <span
                    className={[
                      "text-xs",
                      active ? "text-zinc-900" : "text-zinc-400",
                    ].join(" ")}
                >
                    Paso {s.id}
                </span>
                      <span className="text-sm font-medium text-zinc-900">{s.label}</span>
                  </div>
                </li>
            );
          })}
          </ol>
            {timeLeft !== null && (
              <div className="ml-4 flex w-24 flex-col items-end">
                <span
                  data-testid="countdown"
                  className={[
                    "rounded-full border px-2 py-0.5 text-sm font-medium",
                    aboutToExpire
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-zinc-300 bg-zinc-100 text-zinc-600",
                  ].join(" ")}
                >
                  {`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
                </span>
                {totalTimeRef.current > 0 && (
                  <div className="mt-1 h-1 w-full rounded-full bg-zinc-200">
                    <div
                      data-testid="time-progress"
                      className={[
                        "h-full rounded-full transition-all",
                        aboutToExpire ? "bg-red-600" : "bg-zinc-500",
                      ].join(" ")}
                      style={{
                        width: `${(timeLeft / totalTimeRef.current) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

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
            Atrás
          </button>
          <button
              type="button"
              onClick={next}
              disabled={!canNext || (step === 3 && expired)}
              className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm disabled:opacity-50"
          >
            {step === 3 ? "Pagar" : "Siguiente"}
          </button>
        </div>
      </div>
  );
}
