import React from "react";

export default function ProductSkeleton() {
    return (
        <div className="animate-pulse rounded-2xl border border-zinc-200 p-5 shadow-md">
            <div className="h-40 w-full rounded-xl bg-zinc-200" />
            <div className="mt-4 h-4 w-3/4 rounded bg-zinc-200" />
            <div className="mt-2 h-4 w-1/2 rounded bg-zinc-200" />
            <div className="mt-6 h-6 w-24 rounded-full bg-zinc-200" />
        </div>
    );
}

