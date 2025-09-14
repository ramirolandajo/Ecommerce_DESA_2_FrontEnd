import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/user/userSlice.js";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dispatch(login({ email, password })).unwrap();
      const postLoginRedirect = localStorage.getItem("postLoginRedirect");
      if (postLoginRedirect) {
        navigate(postLoginRedirect);
        localStorage.removeItem("postLoginRedirect");
      } else {
        navigate(from || "/");
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold">
          Iniciar Sesión
        </h2>
        <p className="mb-8 text-center text-gray-500">
          Bienvenido a CompuMundoHMR
        </p>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="tuemail@ejemplo.com"
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Regístrate
          </a>
        </div>
      </div>
    </div>
  );
}
