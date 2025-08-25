import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeItem, updateQuantity, clearCart } from "../store/cartSlice";

export default function Cart() {
  const { items, totalAmount } = useSelector((s) => s.cart);
  const dispatch = useDispatch();

  const increment = (id, qty) =>
    dispatch(updateQuantity({ id, quantity: qty + 1 }));
  const decrement = (id, qty) => {
    if (qty > 1) {
      dispatch(updateQuantity({ id, quantity: qty - 1 }));
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Carrito</h1>
        <p className="text-gray-600">Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Carrito</h1>
      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.id} className="py-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              {typeof item.price === "number" && (
                <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
              )}
            </div>
            <div className="flex items-center">
              <button
                className="px-2 py-1 border rounded-l text-sm"
                onClick={() => decrement(item.id, item.quantity)}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-3 py-1 border-t border-b text-sm">
                {item.quantity}
              </span>
              <button
                className="px-2 py-1 border rounded-r text-sm"
                onClick={() => increment(item.id, item.quantity)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              className="ml-4 text-red-600 text-sm"
              onClick={() => dispatch(removeItem(item.id))}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between font-medium">
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <button
          className="w-full rounded bg-gray-200 px-3 py-2"
          onClick={() => dispatch(clearCart())}
        >
          Vaciar carrito
        </button>
        <Link
          to="/checkout"
          className="block w-full text-center rounded bg-gray-900 text-white px-3 py-2"
        >
          Ir a checkout
        </Link>
      </div>
    </div>
  );
}

