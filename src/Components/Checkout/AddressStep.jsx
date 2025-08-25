import { useState } from "react";
import {
  PencilSquareIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const initial = [
  {
    id: "home",
    title: "2118 Thornridge",
    tag: "HOME",
    lines: ["2118 Thornridge Cir, Syracuse, Connecticut 35624", "(209) 555-0104"],
  },
  {
    id: "office",
    title: "Headoffice",
    tag: "OFFICE",
    lines: ["2715 Ash Dr. San Jose, South Dakota 83475", "(704) 555-0127"],
  },
];

export default function AddressStep({ address, setAddress }) {
  const [list, setList] = useState(initial);

  const remove = (id) => setList((l) => l.filter((i) => i.id !== id));

  return (
      <section className="space-y-6">
        <h2 className="sr-only">Address</h2>

        <div className="space-y-3">
          {list.map((a) => {
            const checked = address === a.id;
            return (
                <label
                    key={a.id}
                    className={[
                      "flex items-start gap-4 rounded-xl border bg-white px-4 py-4 sm:px-6 shadow-sm cursor-pointer",
                      checked ? "border-zinc-900 ring-1 ring-zinc-900/5" : "border-zinc-200",
                    ].join(" ")}
                >
                  <input
                      type="radio"
                      name="address"
                      className="mt-1 h-4 w-4 rounded-full border-zinc-400 text-zinc-900 focus:ring-zinc-900"
                      checked={checked}
                      onChange={() => setAddress(a.id)}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-zinc-900 truncate">{a.title}</p>
                      <span className="inline-flex items-center rounded-sm bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {a.tag}
                  </span>
                    </div>
                    <div className="mt-1 text-sm text-zinc-600 space-y-0.5">
                      {a.lines.map((l, i) => (
                          <p key={i} className="truncate">{l}</p>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-500">
                    <button
                        type="button"
                        className="rounded-md p-2 hover:bg-zinc-100"
                        title="Edit"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => remove(a.id)}
                        className="rounded-md p-2 hover:bg-zinc-100"
                        title="Remove"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </label>
            );
          })}
        </div>

        {/* “Add New Address” centrado con línea punteada */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dotted border-zinc-300" />
          </div>
          <div className="relative flex justify-center">
            <button
                type="button"
                className="group inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50"
                onClick={() =>
                    setList((l) => [
                      ...l,
                      {
                        id: `addr-${l.length + 1}`,
                        title: "New Address",
                        tag: "NEW",
                        lines: ["Street, City, State 00000", "(000) 000-0000"],
                      },
                    ])
                }
            >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300">
              <PlusIcon className="h-3.5 w-3.5" />
            </span>
              Add New Address
            </button>
          </div>
        </div>
      </section>
  );
}
