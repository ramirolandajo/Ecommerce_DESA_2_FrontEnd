import { useState } from "react";

export default function CategoryManagementModal({
    categories,
    onAddCategory,
    onDeleteCategory,
    onClose,
}) {
    const [newCategory, setNewCategory] = useState("");

    const handleAdd = () => {
        if (newCategory.trim() !== "") {
            onAddCategory(newCategory.trim());
            setNewCategory("");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/[0.75] flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Gestión de Categorías</h2>

                <ul className="mb-4 max-h-48 overflow-y-auto p-2">
                    {categories.length === 0 ? (
                        <li className="text-gray-500 text-sm">No hay categorías cargadas.</li>
                    ) : (
                        categories.map((cat) => (
                            <li
                                key={cat.id}
                                className="flex justify-between items-center border-b py-1"
                            >
                                <span>{cat.name}</span>
                                {cat.active ? (
                                                                    <button
                                    onClick={() => onDeleteCategory(cat.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 text-sm"
                                >
                                    Eliminar
                                </button>
                                ) : null}

                            </li>
                        ))
                    )}
                </ul>

                {/* Agregar nueva categoría */}
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Nueva categoría..."
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="border rounded-lg p-2 flex-1"
                    />
                    <button
                        onClick={handleAdd}
                        className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm"
                    >
                        Agregar
                    </button>
                </div>

                {/* Cerrar */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
