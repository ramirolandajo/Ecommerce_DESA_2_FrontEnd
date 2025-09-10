import { useMemo, useState } from "react";

const addDays = (d, n) => {
    const c = new Date(d);
    c.setDate(c.getDate() + n);
    return c;
};
const fmt = (d) =>
    d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });

export default function ShippingStep({ shipping, setShipping }) {
    const today = useMemo(() => new Date(), []);
    const [schedule, setSchedule] = useState("");

    const options = [
        {
            id: "regular",
            title: "Gratis",
            subtitle: "Envío regular",
            note: fmt(addDays(today, 7)),
            price: 0,
        },
        {
            id: "express",
            title: "$8.50",
            subtitle: "Recibe tu pedido lo antes posible",
            note: fmt(addDays(today, 2)),
            price: 8.5,
        },
        {
            id: "scheduled",
            title: "Programar",
            subtitle: "Elige una fecha para recibir tu pedido",
            note: schedule ? schedule : "Seleccionar fecha",
            price: 0,
        },
    ];

    return (
        <section className="space-y-3">
            {options.map((o) => {
                const checked = shipping === o.id;
                return (
                    <label
                        key={o.id}
                        className={[
                            "flex items-center gap-4 justify-between rounded-xl border bg-white px-4 py-4 sm:px-6 shadow-sm cursor-pointer",
                            checked ? "border-zinc-900 ring-1 ring-zinc-900/5" : "border-zinc-200",
                        ].join(" ")}
                    >
                        <div className="flex items-start gap-3">
                            <input
                                type="radio"
                                name="shipping"
                                className="mt-1 h-4 w-4 rounded-full border-zinc-400 text-zinc-900 focus:ring-zinc-900"
                                checked={checked}
                                onChange={() => setShipping(o.id)}
                            />
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-zinc-900">{o.title}</span>
                                    <span className="text-xs text-zinc-500">{o.subtitle}</span>
                                </div>
                                {o.id === "scheduled" && (
                                    <div className="mt-2">
                                        <input
                                            type="date"
                                            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm"
                                            min={fmt(today).split(" ").reverse().join("-") /* noop visual */}
                                            onChange={(e) => setSchedule(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <span className="whitespace-nowrap text-xs text-zinc-600">{o.note}</span>
                    </label>
                );
            })}
        </section>
    );
}
