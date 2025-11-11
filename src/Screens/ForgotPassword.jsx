// src/Screens/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset, validateResetToken, changePassword } from "../api/password";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: token, 3: new password
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await requestPasswordReset(email);
      setMessage("Se ha enviado un correo con el código de recuperación");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  const handleValidateToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await validateResetToken(email, token);
      setMessage("Token válido");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Token inválido");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await changePassword(email, token, newPassword);
      setMessage("Contraseña cambiada exitosamente");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold">Recuperar Contraseña</h2>

        {step === 1 && (
          <form className="space-y-5" onSubmit={handleRequestReset}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                placeholder="tuemail@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar código"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-5" onSubmit={handleValidateToken}>
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-600">
                Código de recuperación
              </label>
              <input
                type="text"
                id="token"
                placeholder="Ingresa el código"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Validando..." : "Validar código"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="space-y-5" onSubmit={handleChangePassword}>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">
                Nueva contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-600 p-3 font-semibold text-white transition duration-200 hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Cambiando..." : "Cambiar contraseña"}
            </button>
          </form>
        )}

        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
        {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}

        <div className="mt-6 text-center text-sm text-gray-600">
          <button onClick={() => navigate("/login")} className="font-medium text-blue-600 hover:text-blue-800">
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
}
