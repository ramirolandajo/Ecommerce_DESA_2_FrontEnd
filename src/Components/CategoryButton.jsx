// src/Components/CategoryButton.jsx
import { CATEGORY_ICON } from "../data/categoryIcons.js";

export default function CategoryButton({ name, selected, onClick, className = "" }) {
    const Icon = CATEGORY_ICON[name];
    return (
        <button
            onClick={onClick}
            className={[
                "inline-flex items-center gap-2 rounded-2xl border text-sm whitespace-nowrap transition",
                selected
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                    : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50",
                className,
            ].join(" ")}
            aria-pressed={selected}
        >
            {Icon && <Icon className="size-4" aria-hidden="true" />}
            <span>{name}</span>
        </button>
    );
}
