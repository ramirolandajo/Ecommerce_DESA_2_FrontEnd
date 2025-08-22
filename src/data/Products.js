// src/data/Products.js
export const tiles = [
    {
        id: "macbook-air",
        eyebrow: "Apple",
        title: "Macbook\nAir",
        description:
            "El nuevo MacBook Air 15'' te da espacio de sobra con Liquid Retina Display.",
        price: 1899,
        cta: { label: "Shop Now", href: "#mac" },
        media: {
            type: "image",
            src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1400&auto=format&fit=crop",
            alt: "Macbook",
        },

        // NUEVO
        category: "Computers",
        isNew: true,
        isBestseller: false,
        isFeatured: true,
    },
    {
        id: "watch-series-9",
        eyebrow: "Apple",
        title: "Watch Series\n9 GPS 41mm",
        description: "Rendimiento y precisión en tu muñeca.",
        price: 399,
        cta: { label: "Buy Now", href: "#watch" },
        media: {
            type: "image",
            src: "https://images.unsplash.com/photo-1624096104992-9b4fa3a279dd?q=80&w=702&auto=format&fit=crop&ixlib=rb-4.1.0",
            alt: "Apple Watch",
        },

        // NUEVO
        category: "Smart Watches",
        isNew: true,
        isBestseller: true,
        isFeatured: false,
    },
    {
        id: "airpods-max",
        eyebrow: "Apple",
        title: "AirPods\nMax Silver",
        description: "Audio de alta fidelidad con cancelación activa de ruido.",
        price: 549,
        oldPrice: 699,
        currency: "USD",
        cta: { href: "#airpods" },
        media: {
            type: "image",
            src: "https://images.unsplash.com/photo-1655628143559-d6ab5a201c9c?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0",
            alt: "AirPods Max",
        },

        // NUEVO
        category: "Headphones",
        isNew: false,
        isBestseller: true,
        isFeatured: true,
    },
    {
        id: "z-fold5",
        eyebrow: "Samsung",
        title: "Galaxy Z\nFold5 256GB",
        description: "Productividad y entretenimiento en formato plegable.",
        price: 1799,
        cta: { label: "Buy Now", href: "#fold" },
        media: {
            type: "image",
            src: "https://images.unsplash.com/photo-1721864428881-dbabb9ea0017?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0",
            alt: "Galaxy Z Fold",
        },

        // NUEVO
        category: "Phones",
        isNew: true,
        isBestseller: false,
        isFeatured: false,
    },
];
