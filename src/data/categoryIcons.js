// src/data/categoryIcons.js
import {
    Smartphone,
    Watch,
    Camera,
    Headphones,
    Monitor,
    Gamepad2,
    Laptop,
    Tablet,
    Printer,
} from "lucide-react";

/**
 * Mapa de íconos por clave canónica
 */
const ICON_BY_KEY = {
    all: Monitor,
    default: Monitor,

    phones: Smartphone,
    computers: Laptop,      // más representativo que Monitor
    headphones: Headphones,
    smartwatches: Watch,
    cameras: Camera,
    gaming: Gamepad2,
    accessories: Gamepad2,
    tablets: Tablet,
    monitors: Monitor,
    printers: Printer,
};

/**
 * Aliases → clave canónica
 * (todo en minúsculas y sin tildes)
 */
const ALIASES = {
    // Phones
    phone: "phones",
    phones: "phones",
    smartphone: "phones",
    smartphones: "phones",
    celular: "phones",
    celulares: "phones",
    moviles: "phones",
    movileses: "phones", // por si viene mal tipeado
    mobiles: "phones",

    // Computers
    computer: "computers",
    computers: "computers",
    pc: "computers",
    pcs: "computers",
    laptop: "computers",
    laptops: "computers",
    notebook: "computers",
    notebooks: "computers",
    computadora: "computers",
    computadoras: "computers",
    ordenadores: "computers",

    // Audio / Headphones
    audio: "headphones",
    auricular: "headphones",
    auriculares: "headphones",
    sonido: "headphones",
    headphones: "headphones",
    headset: "headphones",

    // Wearables / Smart Watches
    wearable: "smartwatches",
    wearables: "smartwatches",
    smartwatch: "smartwatches",
    "smart watch": "smartwatches",
    "smart watches": "smartwatches",
    relojes: "smartwatches",
    reloj: "smartwatches",

    // Cameras
    camera: "cameras",
    cameras: "cameras",
    camara: "cameras",
    camaras: "cameras",

    // Gaming / Accessories
    gaming: "gaming",
    juegos: "gaming",
    consolas: "gaming",
    accesorios: "accessories",
    accesorio: "accessories",
    accessories: "accessories",

    // Tablets
    tablet: "tablets",
    tablets: "tablets",

    // Monitors
    monitor: "monitors",
    monitores: "monitores",
    monitors: "monitores",

    // Printers
    printer: "printers",
    printers: "printers",
    impresora: "printers",
    impresoras: "printers",
    impreso: "printers",     // por si viene esa variante
    impresion: "printers",
};

/** Normaliza: trim, minúsculas y sin acentos */
function normalize(str = "") {
    return String(str)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // quita tildes
}

/**
 * Obtiene el ícono correcto para una categoría cualquiera.
 * - Soporta español/inglés, singular/plural, tildes, typos comunes.
 * - Siempre retorna un fallback seguro.
 */
export function getCategoryIcon(name) {
    const key = normalize(name);
    const canon = ALIASES[key] || key;           // intenta alias → si no, usa la misma key
    return (
        ICON_BY_KEY[canon] ||
        ICON_BY_KEY[name] ||                         // por si viene una clave exacta ya canónica
        ICON_BY_KEY.default
    );
}

// Export opcional: por si en algún lado usás el objeto crudo
export const CATEGORY_ICON = ICON_BY_KEY;
