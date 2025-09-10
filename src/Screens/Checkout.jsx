import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Stepper from "../Components/Checkout/Stepper.jsx";
import { clearCart } from "../store/cart/cartSlice.js";
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

  const createdRef = useRef(false);
  useEffect(() => {
    if (!createdRef.current && purchaseId == null && items.length) {
      createdRef.current = true;
      (async () => {
        try {
          const response = await dispatch(purchaseCreateCart()).unwrap();
          console.log(response);
        } catch (err) {
          console.error(err);
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
    return () => {
      dispatch(cancelPurchase());
    };
  }, [dispatch]);

  useEffect(() => {
    if (timeLeft != null) {
      console.log("timeLeft", timeLeft);
    }
  }, [timeLeft]);

  const money = (n) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n ?? 0);

  const handleConfirm = async (addressId) => {
    console.log("handleConfirm");
    if (!purchaseId) {
      alert("No hay compra pendiente");
      return;
    }
    try {
      await dispatch(confirmPurchase(addressId));
      dispatch(clearCart());
      navigate(`/purchase/${purchaseId}`);
    } catch (err) {
      console.error(err);
      alert("No se pudo confirmar la compra");
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
      <Stepper items={items} money={money} handleConfirm={handleConfirm} />
    </section>
  );
}
