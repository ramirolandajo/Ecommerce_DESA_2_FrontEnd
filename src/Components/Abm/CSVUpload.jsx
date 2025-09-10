import { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadFile } from "../../store/abm/abmSlice";

export default function CsvUploadButton() {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      dispatch(uploadFile(file));
      setShowModal(false);
      setFile(null);
    } else {
      alert("Por favor selecciona un archivo CSV.");
    }
  };

  return (
    <>
      {/* Botón verde */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 max-h-15"
      >
        Cargar productos por .csv
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/[0.75] flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Subir archivo CSV</h2>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mb-2 bg-gray-300 border-1"
            />

            {/* Preview del archivo seleccionado */}
            {file && (
              <div className="mb-4 text-sm text-gray-700">
                Archivo seleccionado: <strong>{file.name}</strong>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowModal(false); setFile(null); }}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpload}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Subir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
