// src/routes/paths.js
export const PATHS = {
    home: "/",
    shop: "/shop",
    product: "/producto/:id",
    notFound: "*",
};

// helper para construir la URL de detalle
export const productUrl = (id) => `/producto/${id}`;
