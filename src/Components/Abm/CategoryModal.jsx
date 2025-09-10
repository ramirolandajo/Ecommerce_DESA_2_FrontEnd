import { useState } from "react";

export default function CategoryModal({ categories, selected, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleCategory = (category) => {
        const exists = selected.some((c) => c.id === category.id);
        const updated = exists
            ? selected.filter((c) => c.id !== category.id)
            : [...selected, category];
        onChange(updated);
    };

    return (
        <div>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300"
            >
                Seleccionar categorías
            </button>

            {selected.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                    {selected.map((c) => c.name).join(", ")}
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 bg-black/[0.75] flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Seleccionar Categorías</h3>

                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {categories.map((cat) => (
                                <label key={cat.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selected.some((c) => c.id === cat.id)}
                                        onChange={() => toggleCategory(cat)}
                                    />
                                    {cat.name}
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="bg-gray-400 text-white px-3 py-1 rounded-lg hover:bg-gray-500"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

