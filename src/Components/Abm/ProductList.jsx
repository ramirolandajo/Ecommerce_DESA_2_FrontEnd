export default function ProductList({ products, onEdit, onDelete}) {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4">Listado de Productos</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Precio</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No hay productos cargados.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-2 border">{p.productCode}</td>
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">${p.unitPrice}</td>
                <td className="p-2 border">{p.stock}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  {p.active ? (
                    <button
                      onClick={() => onDelete(p.productCode)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                    >
                      Eliminar
                    </button>) : null}

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
