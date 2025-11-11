import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Stepper from "../Components/Checkout/Stepper.jsx";
import { clearCart } from "../store/cart/cartSlice.js";
import { showNotification } from "../store/notification/notificationSlice.js";
import {
  createCart as purchaseCreateCart,
  confirmPurchase,
  cancelPurchase,
} from "../store/purchase/purchaseSlice.js";

export default function Checkout() {
  const { items = [] } = useSelector((s) => s.cart) ?? {};
  const { id: purchaseId, timeLeft } = useSelector((s) => s.purchase ?? {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const createdRef = useRef(false);
  useEffect(() => {
    if (!createdRef.current && purchaseId == null && items.length) {
      createdRef.current = true;
      (async () => {
        console.log("Items del carrito a enviar al back:", items);
        try {
          setLoading(true);
          const response = await dispatch(purchaseCreateCart()).unwrap();
          console.log(response);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [dispatch, purchaseId, items]);

  const cancelRef = useRef(false);
  useEffect(() => {
    if (!cancelRef.current) {
      cancelRef.current = true;
      return;
    }
    // return () => {
    //   dispatch(cancelPurchase());
    // }; // Desactivado temporalmente para pruebas
  }, [dispatch]);

  useEffect(() => {
    if (timeLeft != null) {
      console.log("timeLeft", timeLeft);
    }
  }, [timeLeft]);

  const money = (n) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n ?? 0);

  const handleConfirm = async (addressId) => {
    console.log("handleConfirm");
    if (!purchaseId) {
      alert("No hay compra pendiente");
      return;
    }
    setLoading(true);
    try {
      const result = await dispatch(confirmPurchase(addressId)).unwrap();
      console.log("Respuesta del backend al confirmar compra:", result);
      dispatch(clearCart());
      navigate(`/purchase/${purchaseId}`);
    } catch (err) {
      console.error(err);
      dispatch(showNotification({ message: err.response?.data?.error || err.message || "No se pudo confirmar la compra", type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    setShowCancelModal(false);
    setLoading(true);
    try {
      const result = await dispatch(cancelPurchase()).unwrap();
      console.log("Respuesta del backend al cancelar compra:", result);
      navigate('/');
    } catch (err) {
      console.error(err);
      dispatch(showNotification({ message: err.response?.data?.error || err.message || "No se pudo cancelar la compra", type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-4 text-3xl font-bold">Finalizar compra</h1>
        <p className="text-zinc-600">No hay productos en el carrito.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Finalizar compra</h1>
      <Stepper
        items={items}
        money={money}
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
        loading={loading}
      />

      {/* Modal de cancelar compra */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">¿Quieres cancelar tu compra?</h2>
            <p className="text-sm text-zinc-600 mb-6">¿Estás seguro? Esta acción no se puede deshacer.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 rounded hover:bg-zinc-200"
              >
                No
              </button>
              <button
                onClick={confirmCancel}
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Cancelando...' : 'Sí, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
