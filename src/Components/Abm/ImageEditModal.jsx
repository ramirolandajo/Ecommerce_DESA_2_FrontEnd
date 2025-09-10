import { useState } from "react";

export default function ImageEditModal({ initialUrl, onSave, onClose }) {
    const [newUrl, setNewUrl] = useState(initialUrl || "");

    const handleSave = () => {
        onSave(newUrl);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/[0.75] flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg w-[400px]">
                <h2 className="text-lg font-semibold mb-4">Editar Imagen</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="URL de la imagen"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="border rounded-lg p-2 w-full"
                        required
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
