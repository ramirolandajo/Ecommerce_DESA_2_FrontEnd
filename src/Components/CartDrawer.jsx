// src/components/CartDrawer.jsx
import { Fragment, useRef, useMemo } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    removeItem,
    updateQuantity,
    clearCart,
    incrementItem,
    decrementItem,
} from "../store/cart/cartSlice.js";
import { PATHS } from "../routes/paths.js";

export default function CartDrawer({ open, onClose }) {
    const { items = [] } = useSelector((s) => s.cart ?? {});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const closeButtonRef = useRef(null);

    // Subtotal calculado (evita depender de totalAmount por si se desincroniza)
    const subtotal = useMemo(
        () =>
            items.reduce(
                (acc, i) => acc + Number(i.price ?? 0) * Number(i.quantity ?? 1),
                0
            ),
        [items]
    );

    const money = (n) =>
        new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
        }).format(Number(n) || 0);

    const handleCheckout = () => {
        navigate(PATHS.checkout);
        onClose();
    };

    return (
        <Transition show={open} appear as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={onClose}
                initialFocus={closeButtonRef}
            >
                {/* Backdrop con fade */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-[1px] motion-reduce:transition-none" />
                </TransitionChild>

                {/* Contenedor del panel */}
                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 flex justify-end">
                        {/* Panel con slide desde la derecha */}
                        <TransitionChild
                            as={Fragment}
                            enter="transform ease-out duration-300"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform ease-in duration-200"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <DialogPanel
                                className="relative h-dvh w-full max-w-[420px] sm:max-w-[480px]
                           bg-white shadow-2xl border-l border-zinc-200 flex flex-col
                           motion-reduce:transform-none motion-reduce:transition-none"
                            >
                                {/* Header */}
                                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/95 px-5 py-4 backdrop-blur">
                                    <div>
                                        <h2 className="text-lg font-semibold text-zinc-900">Tu carrito</h2>
                                        <p className="text-xs text-zinc-500">{items.length} producto(s)</p>
                                    </div>
                                    <button
                                        ref={closeButtonRef}
                                        className="p-2 text-zinc-600 hover:text-zinc-900"
                                        aria-label="Cerrar carrito"
                                        onClick={onClose}
                                        type="button"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                {items.length === 0 ? (
                                    <EmptyState onClose={onClose} />
                                ) : (
                                    <div className="flex h-[calc(100dvh-64px)] flex-col">
                                        {/* Lista */}
                                        <ul className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                                            {items.map((item) => {
                                                console.log('CartDrawer item:', item);
                                                const qty = Number(item.quantity ?? 1);
                                                const unit = Number(item.price ?? 0);
                                                const line = unit * qty;
                                                return (
                                                    <li
                                                        key={`${item.id}-${item.variant ?? ""}`}
                                                        className="flex items-center gap-4"
                                                    >
                                                        <img
                                                            src={
                                                                item.image ||
                                                                "https://via.placeholder.com/150?text=No+Image"
                                                            }
                                                            alt={item.title}
                                                            className="h-16 w-16 rounded border border-zinc-200 object-cover"
                                                        />

                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-medium text-zinc-900">
                                                                {item.title}
                                                            </p>
                                                            <p className="text-xs text-zinc-500">#{item.id}</p>

                                                            <div className="mt-2 flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    className="h-8 w-8 rounded border border-zinc-300 text-zinc-700 disabled:opacity-40"
                                                                    aria-label={`Disminuir cantidad de ${item.title}`}
                                                                    onClick={() => dispatch(decrementItem(item.id))}
                                                                    disabled={qty <= 1}
                                                                >
                                                                    –
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    min={0}
                                                                    value={qty}
                                                                    onChange={(e) =>
                                                                        handleQtyChange(dispatch, item.id, e.target.value)
                                                                    }
                                                                    className="h-8 w-12 rounded border border-zinc-300 text-center text-sm"
                                                                    aria-label={`Cantidad de ${item.title}`}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="h-8 w-8 rounded border border-zinc-300 text-zinc-700"
                                                                    aria-label={`Aumentar cantidad de ${item.title}`}
                                                                    onClick={() => dispatch(incrementItem(item.id))}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-sm font-semibold text-zinc-900">
                                                                {money(line)}
                                                            </p>
                                                            <p className="text-[11px] text-zinc-500">{money(unit)} c/u</p>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="ml-1 rounded p-1 text-zinc-400 hover:text-red-600"
                                                            onClick={() => dispatch(removeItem(item.id))}
                                                            aria-label={`Eliminar ${item.title}`}
                                                            title="Eliminar"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>

                                        {/* Footer fijo */}
                                        <div className="sticky bottom-0 space-y-3 border-t border-zinc-200 bg-white/95 px-5 py-4 backdrop-blur">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-zinc-700">Subtotal</span>
                                                <span className="font-semibold text-zinc-900">
                          {money(subtotal)}
                        </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleCheckout}
                                                className="block w-full rounded-lg bg-black py-3 text-center text-white font-medium hover:bg-zinc-800"
                                            >
                                                Finalizar compra
                                            </button>

                                            <div className="flex gap-2">
                                                <Link
                                                    to={PATHS.cart}
                                                    onClick={onClose}
                                                    className="flex-1 rounded-lg border border-zinc-300 py-2.5 text-center text-sm hover:bg-zinc-50"
                                                >
                                                    Ver carrito
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="rounded-lg border border-red-200 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                                    onClick={() => dispatch(clearCart())}
                                                >
                                                    Vaciar
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="w-full text-center text-sm text-zinc-500 hover:text-zinc-700"
                                            >
                                                Seguir comprando
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

// ---- helpers/child components ----

function handleQtyChange(dispatch, id, qty) {
    const quantity = Number(qty);
    if (Number.isFinite(quantity) && quantity > 0) {
        dispatch(updateQuantity({ id, quantity }));
    } else if (quantity <= 0) {
        dispatch(removeItem(id));
    }
}

function EmptyState({ onClose }) {
    return (
        <div className="flex h-[calc(100dvh-64px)] flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="h-16 w-16 rounded-full bg-zinc-100 flex items-center justify-center">
                <CartIcon />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Tu carrito está vacío</h3>
            <p className="text-sm text-zinc-500">
                Agregá productos y volvé para finalizar la compra.
            </p>
            <button
                onClick={onClose}
                className="mt-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50"
            >
                Seguir explorando
            </button>
        </div>
    );
}

function CartIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-zinc-400" fill="none" stroke="currentColor">
            <path strokeWidth="1.5" d="M3 3h2l.4 2M7 13h9l3-7H6.4" />
            <circle cx="9" cy="19" r="1.5" />
            <circle cx="18" cy="19" r="1.5" />
        </svg>
    );
}
