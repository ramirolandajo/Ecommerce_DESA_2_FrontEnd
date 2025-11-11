// src/Screens/UserProfile.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/user/userSlice.js";
import { showNotification } from "../store/notification/notificationSlice.js";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [loading, setLoading] = useState(false);

  const handleDeactivate = async () => {
    if (!confirm("¿Estás seguro de que quieres desactivar tu cuenta? Esta acción no se puede deshacer.")) return;
    setLoading(true);
    try {
      // Assume there's an API to deactivate
      // await deactivateAccount();
      dispatch(logout());
      dispatch(showNotification({ message: "Cuenta desactivada", type: "info" }));
      navigate("/");
    } catch (error) {
      dispatch(showNotification({ message: "Error al desactivar cuenta", type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Mi cuenta</h1>
      <div className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700">Nombre</label>
          <p className="text-zinc-900">{userInfo?.name || "N/A"}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700">Email</label>
          <p className="text-zinc-900">{userInfo?.email || "N/A"}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleDeactivate}
            disabled={loading}
            className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Desactivando..." : "Desactivar cuenta"}
          </button>
        </div>
      </div>
    </div>
  );
}
