import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBrands, getCategories } from "../../store/abm/abmSlice";
import CategoryModal from "./CategoryModal";
import { Pencil } from "lucide-react";
import ImageEditModal from "./ImageEditModal";
import CsvUploadButton from "./CSVUpload";

const initialFormState = {
    productCode: "",
    name: "",
    description: "",
    price: "",
    unitPrice: 0,
    discount: "",
    stock: "",
    calification: 0,
    categories: [],
    brand: "",
    images: [],
    hero: false,
    active: true,
    new: false,
    bestSeller: false,
    featured: false,
};

export default function ProductForm({ onSave, editingProduct, onCancel }) {
    const [form, setForm] = useState(initialFormState);
    const [showCategories, setShowCategories] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    const dispatch = useDispatch();
    const categories = useSelector((state) => state.abm.categories);
    const brands = useSelector((state) => state.abm.brands);

    useEffect(() => {
        dispatch(getCategories());
        dispatch(getBrands());
    }, [dispatch]);

    useEffect(() => {
        if (editingProduct) {
            let normalizedImages = [];
            if (Array.isArray(editingProduct.images)) {
                normalizedImages = editingProduct.images.flatMap(img => {
                    try {
                        const parsed = JSON.parse(img); // caso ["url1", "url2"]
                        return Array.isArray(parsed) ? parsed : [img];
                    } catch {
                        return [img]; // caso string plano
                    }
                });
            }

            setForm({
                productCode: editingProduct.productCode || "",
                name: editingProduct.name || "",
                description: editingProduct.description || "",
                price: editingProduct.price || "",
                unitPrice: editingProduct.unitPrice || 0,
                discount: editingProduct.discount || "",
                stock: editingProduct.stock || "",
                calification: editingProduct.calification || 0,
                categories: editingProduct.categories || [],
                brand: editingProduct.brand || null,
                images: normalizedImages,   // ✅ ya vienen normalizadas
                hero: editingProduct.hero || false,
                active: editingProduct.active ?? true,
                new: editingProduct.new || false,
                bestSeller: editingProduct.bestSeller || false,
                featured: editingProduct.featured || false,
            });
        } else {
            setForm(initialFormState);
        }
    }, [editingProduct]);


    useEffect(() => {
        const unitPrice = parseFloat(form.unitPrice) || 0; // precio normal
        const discount = parseFloat(form.discount) || 0;

        const price = unitPrice - unitPrice * (discount / 100); // precio con descuento
        setForm((prev) => ({ ...prev, price: price.toFixed(2) }));
    }, [form.unitPrice, form.discount]);


    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        //TODO: Preparar onSave para guardar los datos como lo pide el back

        onSave({
            productCode: parseInt(form.productCode),
            name: form.name,
            description: form.description,
            unitPrice: parseFloat(form.unitPrice),   // 👈 precio normal
            price: parseFloat(form.price),           // 👈 precio con descuento
            discount: parseFloat(form.discount),
            stock: parseInt(form.stock),
            categories: form.categories.map(c => c.id),
            brand: form.brand.id,
            calification: parseFloat(form.calification),
            images: form.images,
            isNew: form.new,
            isBestSeller: form.bestSeller,
            isFeatured: form.featured,
            hero: form.hero,
            active: form.active
        });


        setForm(initialFormState);
    };

    const handleCancel = () => {
        setForm(initialFormState);
        onCancel && onCancel();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-xl p-4 space-y-4"
        >
            <h2 className="text-lg font-semibold">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </h2>


            <div className="flex gap-4 flex-wrap items-end">
                {form.images.length > 0 ? (
                    form.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative w-40 h-40 group">
                            <img
                                src={imgUrl}
                                alt={`Imagen ${idx + 1}`}
                                className="w-full h-full object-cover rounded-lg group-hover:opacity-50 transition"
                            />

                            {/* Botón Editar */}
                            <button
                                type="button"
                                onClick={() => setShowImageModal({ index: idx, url: imgUrl })}
                                className="absolute top-2 left-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                            >
                                <Pencil className="w-5 h-5" />
                            </button>

                            {/* Botón Eliminar */}
                            <button
                                type="button"
                                onClick={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        images: prev.images.filter((_, i) => i !== idx),
                                    }))
                                }
                                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                            >
                                ✕
                            </button>
                        </div>
                    ))
                ) : (
                    null
                )}

                {/* Botón Agregar Imagen */}
                <button
                    type="button"
                    onClick={() => setShowImageModal({ index: null, url: "" })}
                    className="w-40 h-40 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
                >
                    + Agregar imagen
                </button>

                {/* CSVUpload solo si no hay imágenes */}
                {!editingProduct && <CsvUploadButton />}
            </div>




            <div className="grid grid-cols-2 gap-4">
                <input
                    name="productCode"
                    placeholder="Código de producto"
                    type="number"
                    value={form.productCode}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    required
                />
                <input
                    name="name"
                    placeholder="Nombre"
                    value={form.name}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    required
                />
                <input
                    name="unitPrice"
                    placeholder="Precio Normal"
                    type="number"
                    value={form.unitPrice}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    required
                />
                <input
                    name="discount"
                    placeholder="Descuento (%)"
                    type="number"
                    value={form.discount}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                />
                <input
                    name="price"
                    placeholder="Precio con Descuento"
                    type="number"
                    value={form.price}
                    readOnly
                    className="border rounded-lg p-2 w-full bg-gray-100 cursor-not-allowed"
                />

                <input
                    name="stock"
                    placeholder="Stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    required
                />
                <input
                    name="calification"
                    placeholder="Calificación"
                    type="number"
                    step="0.1"
                    value={form.calification}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full bg-gray-100 cursor-not-allowed"
                    readOnly
                />
                <CategoryModal
                    categories={categories}
                    selected={form.categories}
                    onChange={(newCategories) =>
                        setForm((prev) => ({ ...prev, categories: newCategories }))
                    }
                />

            </div>


            {/* Dropdown de Marca */}
            <div>
                <label className="block font-semibold mb-1">Marca</label>
                <select
                    name="brand"
                    value={form.brand?.id || ""}
                    onChange={(e) => {
                        const brandId = parseInt(e.target.value);
                        const selectedBrand = brands.find((b) => b.id === brandId);
                        setForm((prev) => ({ ...prev, brand: selectedBrand }));
                    }}
                    className="border rounded-lg p-2 w-full"
                    required
                >
                    <option value="">Seleccionar marca</option>
                    {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>
            </div>

            <textarea
                name="description"
                placeholder="Descripción"
                value={form.description}
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
            />

            <div className="grid grid-cols-2 gap-4">
                {["hero", "active", "new", "bestSeller", "featured"].map((field) => (
                    <label key={field} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name={field}
                            checked={form[field]}
                            onChange={handleChange}
                        />
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                ))}
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    {editingProduct ? "Actualizar" : "Guardar"}
                </button>
                {editingProduct && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                    >
                        Cancelar
                    </button>
                )}
            </div>
            {showCategories && (
                <CategoryModal
                    categories={categories}
                    selectedCategories={form.categories}
                    onSave={(selected) => setForm({ ...form, categories: selected })}
                    onClose={() => setShowCategories(false)}
                />
            )}

            {showImageModal && (
                <ImageEditModal
                    initialUrl={showImageModal.url}
                    onSave={(newUrl) => {
                        setForm((prev) => {
                            let updatedImages = [...prev.images];
                            if (showImageModal.index !== null) {
                                // Editar imagen existente
                                updatedImages[showImageModal.index] = newUrl;
                            } else {
                                // Agregar nueva imagen
                                updatedImages.push(newUrl);
                            }
                            return { ...prev, images: updatedImages };
                        });
                        setShowImageModal(false);
                    }}
                    onClose={() => setShowImageModal(false)}
                />
            )}


        </form>
    );
}
