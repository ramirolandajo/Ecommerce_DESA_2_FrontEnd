export default function Footer() {
    return (
        <footer className="bg-black text-gray-300">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
                {/* grid: 1 col → 2 cols (md) → 12 cols (lg) */}
                <div className="grid grid-cols-1 gap-y-10 gap-x-8 md:grid-cols-2 lg:grid-cols-12">
                    {/* Brand */}
                    <div className="min-w-0 lg:col-span-6">
                        <a
                            href="#"
                            className="shrink-0 mr-4 md:mr-8 font-black text-3xl tracking-tight text-white"
                        >
                            cyber
                        </a>

                        <p className="mt-6 max-w-xl text-gray-400 leading-relaxed break-words">
                            We are a residential interior design firm located in Portland.
                            Our boutique–studio offers more than
                        </p>

                        {/* Redes: que no rompan en mobile */}
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            {[
                                { label: "Twitter", path: "M18.244 2H21.5l-7.5 8.57L22.5 22h-6.77l-5.3-6.41L4.3 22H1l8.08-9.24L1 2h6.82l4.79 5.97L18.244 2Zm-1.183 18h1.885L7.028 4h-1.9L17.06 20Z" },
                                { label: "Facebook", path: "M22 12.073C22 6.505 17.523 2 12 2S2 6.505 2 12.073c0 5.017 3.657 9.183 8.438 9.927v-7.022H7.898v-2.905h2.54V9.845c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.47h-1.26c-1.243 0-1.631.774-1.631 1.568v1.883h2.773l-.443 2.905h-2.33V22c4.78-.744 8.438-4.91 8.438-9.927Z" },
                                { label: "TikTok", path: "M21 8.5a7.5 7.5 0 0 1-4.5-1.5v7.07a6.07 6.07 0 1 1-6.07-6.07c.21 0 .42.01.62.04v3.07a3.08 3.08 0 1 0 2.43 3V2h3.1a7.5 7.5 0 0 0 4.42 4.42V8.5Z" },
                                { label: "Instagram", path: "M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6.001A3 3 0 0 1 12 15Zm5.9-7.93a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 2c3.2 0 3.58.01 4.85.07 1.26.06 2.13.26 2.88.56.78.3 1.45.71 2.11 1.37.66.66 1.07 1.33 1.38 2.11.29.75.49 1.62.55 2.88.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.06 1.26-.26 2.13-.55 2.88a5.9 5.9 0 0 1-1.38 2.11c-.66.66-1.33 1.07-2.11 1.38-.75.29-1.62.49-2.88.55-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.26-.06-2.13-.26-2.88-.55a5.9 5.9 0 0 1-2.11-1.38 5.9 5.9 0 0 1-1.38-2.11c-.29-.75-.49-1.62-.55-2.88C2.01 15.58 2 15.2 2 12s.01-3.58.07-4.85c.06-1.26.26-2.13.55-2.88.31-.78.72-1.45 1.38-2.11A5.9 5.9 0 0 1 6.06.67c.75-.29 1.62-.49 2.88-.55C10.2.06 10.58.05 13.78.05h.01Z" },
                            ].map((icon) => (
                                <a
                                    key={icon.label}
                                    href="#"
                                    aria-label={icon.label}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-white/30"
                                >
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-gray-300">
                                        <path d={icon.path} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Columna Services */}
                    <nav className="min-w-0 lg:col-span-3">
                        <h4 className="text-lg font-semibold text-white">Services</h4>
                        <ul className="mt-6 space-y-4">
                            {[
                                "Bonus program",
                                "Gift cards",
                                "Credit and payment",
                                "Service contracts",
                                "Non-cash account",
                                "Payment",
                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="block break-words hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Columna Assistance */}
                    <nav className="min-w-0 lg:col-span-3">
                        <h4 className="text-lg font-semibold text-white">
                            Assistance to the buyer
                        </h4>
                        <ul className="mt-6 space-y-4">
                            {[
                                "Find an order",
                                "Terms of delivery",
                                "Exchange and return of goods",
                                "Guarantee",
                                "Frequently asked questions",
                                "Terms of use of the site",
                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="block break-words hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Mini‑footer */}
                <div className="mt-12 border-t border-white/10 pt-6 text-sm text-gray-500">
                    © {new Date().getFullYear()} cyber. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
