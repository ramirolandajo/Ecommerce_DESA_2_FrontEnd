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
                            CompuMundoHMR
                        </a>

                        <p className="mt-6 max-w-xl text-gray-400 leading-relaxed break-words">
                            Somos una tienda en línea especializada en productos exclusivos y de alta calidad.
                            Ofrecemos una experiencia de compra personalizada y segura para nuestros clientes.
                        </p>

                    </div>

                </div>

                {/* Mini‑footer */}
                <div className="mt-12 border-t border-white/10 pt-6 text-sm text-gray-500">
                    © {new Date().getFullYear()} CompuMundoHMR. Todos los derechos reservados. Test web
                </div>
            </div>
        </footer>
    );
}
