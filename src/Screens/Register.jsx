import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../store/user/userSlice.js";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await dispatch(register({ name, email, password })).unwrap();
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold">Crear Cuenta</h2>
        <p className="mb-8 text-center text-gray-500">Únete a CompuMundoHMR</p>

        <form className="space-y-5" onSubmit={handleRegister}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

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
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          {error && <p className="text-center text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-600 p-3 font-semibold text-white transition duration-200 hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Registrarme"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="font-medium text-green-600 hover:text-green-800">
            Inicia sesión
          </a>
        </div>
      </div>
    </div>
  );
}
