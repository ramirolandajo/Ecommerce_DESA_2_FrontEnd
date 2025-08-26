import React from "react";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold">
          Iniciar Sesión
        </h2>
        <p className="mb-8 text-center text-gray-500">
          Bienvenido a Cyber
        </p>

        <form className="space-y-5">
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
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white transition duration-200 hover:bg-blue-700"
          >
            Entrar
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
