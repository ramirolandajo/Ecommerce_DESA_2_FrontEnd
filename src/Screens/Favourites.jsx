import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GlassProductCard from "../Components/GlassProductCard.jsx";
import Loader from "../Components/Loader.jsx";
import { fetchFavourites } from "../store/favourites/favouritesSlice.js";

export default function Favourites() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.favourites);

  useEffect(() => {
    // Siempre obtener favoritos cuando se monta la pantalla para evitar datos inconsistentes
    dispatch(fetchFavourites());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <section className="mx-auto flex max-w-3xl items-center justify-center px-4 py-12">
        <Loader />
      </section>
    );
  }

  return (
    <section className="px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Favoritos</h1>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">No tienes productos favoritos.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <GlassProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
