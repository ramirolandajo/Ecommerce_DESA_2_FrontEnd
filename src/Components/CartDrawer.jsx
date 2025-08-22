import { XMarkIcon } from "@heroicons/react/24/outline";

export default function CartDrawer({ open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-40 h-full w-64 bg-white p-4 border-l border-gray-200 transform transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-lg">Cart</h2>
          <button
            className="p-2 text-gray-700 hover:text-gray-900"
            aria-label="Close cart"
            onClick={onClose}
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>
        <p>Carrito vacío</p>
      </aside>
    </>
  );
}
