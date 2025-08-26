import React from "react";

export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold">
          Crear Cuenta
        </h2>
        <p className="mb-8 text-center text-gray-500">
          Únete a Cyber
        </p>

        <form className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              placeholder="Tu nombre"
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-600"
            >
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-green-600 p-3 font-semibold text-white transition duration-200 hover:bg-green-700"
          >
            Registrarme
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <a
            href="/login"
            className="font-medium text-green-600 hover:text-green-800"
          >
            Inicia sesión
          </a>
        </div>
      </div>
    </div>
  );
}
