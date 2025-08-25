// src/Components/Breadcrumbs.jsx
import { Link } from "react-router-dom";

export default function Breadcrumbs({ segments = [] }) {
    return (
        <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-zinc-500">
                {segments.map((seg, i) => {
                    const isLast = i === segments.length - 1;
                    const content = !isLast && seg.to ? (
                        <Link to={seg.to} className="text-indigo-600 hover:underline">
                            {seg.label}
                        </Link>
                    ) : (
                        <span className={isLast ? "text-zinc-900" : undefined}>{seg.label}</span>
                    );
                    return (
                        <li key={i} className="flex items-center gap-1">
                            {content}
                            {!isLast && <span className="text-zinc-400">/</span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
