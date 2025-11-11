import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail } from "../store/user/userSlice.js";

export default function VerifyEmail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialEmail = state?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(verifyEmail({ email, token })).unwrap();
      setIsSuccess(true);
      setMessage("¡Verificación exitosa!");
      setTimeout(() => {
        navigate("/login");
      }, 1500); // Redirige después de 1.5 segundos
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.error || err.message || "La verificación falló.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold">Verificar Email</h2>
        {initialEmail && (
          <p className="mb-4 text-center text-gray-600">
            Hemos enviado un código de verificación a <span className="font-semibold">{initialEmail}</span>. Revisa tu bandeja de entrada.
          </p>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="tuemail@ejemplo.com"
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-600">
              Token de verificación
            </label>
            <input
              type="text"
              id="token"
              placeholder="Ingresa el token"
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white transition duration-200 hover:bg-blue-700"
          >
            Verificar
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${isSuccess ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
