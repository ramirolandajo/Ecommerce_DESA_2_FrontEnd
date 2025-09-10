import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBrands, getCategories } from "../../store/abm/abmSlice";

export default function ProductFilters({ onFilter }) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.abm.categories);
  const brands = useSelector((state) => state.abm.brands);

  const [searchText, setSearchText] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getBrands());
  }, [dispatch]);

  // Filtramos automáticamente cada vez que cambia algún filtro
  useEffect(() => {
    onFilter({
      searchText,
      categoryId: categoryId ? parseInt(categoryId) : null,
      brandId: brandId ? parseInt(brandId) : null,
    });
  }, [searchText, categoryId, brandId, onFilter]);

  return (
    <div className="bg-white shadow rounded-xl p-4 flex gap-4 items-center">
      <input
        type="text"
        placeholder="Buscar producto..."
        className="border rounded-lg p-2 w-full"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <select
        className="border rounded-lg p-2"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categories &&
          categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
      </select>

      <select
        className="border rounded-lg p-2"
        value={brandId}
        onChange={(e) => setBrandId(e.target.value)}
      >
        <option value="">Todas las marcas</option>
        {brands &&
          brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
      </select>
    </div>
  );
}
