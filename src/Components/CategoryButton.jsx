// src/Components/CategoryButton.jsx
import { CATEGORY_ICON } from "../data/categoryIcons.js";

export default function CategoryButton({ name, selected, onClick, className = "", ariaLabel, count }) {
    const Icon = CATEGORY_ICON[name];
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "inline-flex items-center gap-3 px-3 py-2 rounded-2xl text-sm transition-all select-none",
                selected
                    ? "bg-slate-900 text-white shadow-md border border-slate-800"
                    : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                className,
            ].join(" ")}
            aria-pressed={selected}
            aria-label={ariaLabel || `Categoría ${name}`}
            title={name}
        >
            {Icon ? (
                <span className={selected ? "inline-flex items-center justify-center h-7 w-7 rounded-md bg-white/10" : "inline-flex items-center justify-center h-7 w-7 rounded-md bg-zinc-100"}>
                    <Icon className={selected ? "h-4 w-4 text-white" : "h-4 w-4 text-zinc-700"} aria-hidden="true" />
                </span>
            ) : null}
            <span className="whitespace-nowrap font-medium">{name}</span>
            {typeof count === 'number' ? (
                <span className={selected ? "ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs bg-white/10 text-white" : "ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs bg-zinc-100 text-zinc-700"}>
                    {count}
                </span>
            ) : null}
        </button>
    );
}
