import React from 'react';

export default function HeroSkeleton() {
  return (
    <section className="w-full bg-gradient-to-br from-slate-800 via-black to-slate-900 text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[280px_140px] xl:grid-rows-[340px_160px] gap-6 lg:gap-8">
          {/* Large left card (medium) */}
          <div className="rounded-3xl overflow-hidden border border-slate-700/40 bg-gradient-to-t from-slate-700/20 to-transparent h-72 lg:h-full">
            <div className="h-full w-full flex flex-col justify-end p-6">
              <div className="animate-pulse max-w-[70%]">
                <div className="h-6 rounded bg-slate-600/40 mb-3" />
                <div className="h-4 rounded bg-slate-600/30 mb-2 w-4/6" />
                <div className="h-4 rounded bg-slate-600/30 mb-4 w-2/6" />
                <div className="h-10 w-32 rounded-full bg-slate-600/50" />
              </div>
            </div>
          </div>

          {/* Tall right card */}
          <div className="rounded-3xl overflow-hidden border border-slate-700/40 bg-gradient-to-t from-slate-700/20 to-transparent lg:row-span-2 h-72 lg:h-full">
            <div className="h-full w-full flex items-end p-6">
              <div className="w-full animate-pulse">
                <div className="h-8 rounded bg-slate-600/40 mb-3 w-3/4" />
                <div className="h-4 rounded bg-slate-600/30 mb-2 w-2/3" />
                <div className="h-4 rounded bg-slate-600/30 mb-4 w-1/3" />
                <div className="h-10 w-28 rounded-full bg-slate-600/50" />
              </div>
            </div>
          </div>

          {/* Two small cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl overflow-hidden border border-slate-700/40 bg-gradient-to-t from-slate-700/20 to-transparent h-36 flex items-end p-4">
              <div className="w-full animate-pulse">
                <div className="h-4 rounded bg-slate-600/40 mb-2 w-3/4" />
                <div className="h-4 rounded bg-slate-600/30 w-1/2" />
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden border border-slate-700/40 bg-gradient-to-t from-slate-700/20 to-transparent h-36 flex items-end p-4">
              <div className="w-full animate-pulse">
                <div className="h-4 rounded bg-slate-600/40 mb-2 w-3/4" />
                <div className="h-4 rounded bg-slate-600/30 w-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls / pagination skeleton */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="animate-pulse flex gap-2">
              <div className="h-2 w-8 rounded-full bg-slate-600/40" />
              <div className="h-2 w-8 rounded-full bg-slate-600/40" />
              <div className="h-2 w-8 rounded-full bg-slate-600/40" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="h-9 w-28 rounded-xl bg-slate-700/40 animate-pulse" />
            <div className="h-9 w-28 rounded-xl bg-slate-700/40 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
