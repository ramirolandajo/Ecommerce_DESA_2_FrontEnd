// src/utils/getMatchScore.js
// Búsqueda "inteligente" para e-commerce tech ES/EN.
// - Normaliza strings (acentos, guiones, case, espacios).
// - Sinónimos amplios (phones, laptops, gaming, audio, foto, redes, etc).
// - Pondera exacto, inclusión, sinónimos y overlap de tokens.
// - Boost para queries "celular/telefono/smartphone" en categorías Phones.

const _memoNorm = new Map();
export function normalize(s = "") {
  if (_memoNorm.has(s)) return _memoNorm.get(s);
  const out = String(s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quita acentos
      .replace(/[_\-./]+/g, " ")       // separadores a espacios
      .replace(/\s+/g, " ")            // colapsa espacios
      .trim();
  _memoNorm.set(s, out);
  return out;
}

export function tokenize(s = "") {
  const t = normalize(s).split(" ").filter(Boolean);
  // singularización súper básica (sirve para “phones” → “phone”)
  return t.map((w) => (w.endsWith("s") && w.length > 3 ? w.slice(0, -1) : w));
}

// ---- Sinónimos / alias (clave canónica → relacionados) ----
const SYNONYMS = {
  // Phones & mobile
  telefono: ["celular", "movil", "smartphone", "phone", "iphone", "android", "celu"],
  celular: ["telefono", "movil", "smartphone", "phone", "iphone", "android", "celu", "smartphones", "phones"],
  smartphone: ["telefono", "celular", "movil", "phone", "iphone", "android", "smartphones"],
  iphone: ["apple phone", "smartphone", "telefono", "celular"],
  android: ["smartphone", "telefono", "celular"],

  // Laptops & computers
  laptop: ["notebook", "portatil", "ultrabook", "macbook", "computadora", "ordenador", "pc"],
  notebook: ["laptop", "portatil", "ultrabook", "macbook"],
  computadora: ["pc", "ordenador", "desktop", "torre", "equipo"],
  pc: ["computadora", "ordenador", "desktop", "torre", "equipo"],
  macbook: ["laptop", "notebook", "portatil"],

  // Tablets & e-readers
  tablet: ["ipad", "tableta"],
  ereader: ["ebook", "kindle"],

  // Monitors / TVs / Displays
  monitor: ["pantalla", "display"],
  television: ["tv", "smart tv", "tele", "televisor", "pantalla"],
  tv: ["television", "smart tv", "televisor"],
  proyector: ["projector", "beam"],

  // Audio
  auricular: ["headphone", "headset", "cascos", "audifono", "audifonos", "headphones"],
  earbuds: ["tws", "true wireless", "in ear", "in-ear", "airpods"],
  airpod: ["airpods", "earbuds", "tws"],
  parlante: ["bocina", "altavoz", "speaker", "sound", "sonido"],
  soundbar: ["barra de sonido"],
  microfono: ["microphone", "mic"],

  // Cameras & photo
  camara: ["camera", "foto", "fotografia", "dslr", "mirrorless", "webcam"],
  lente: ["objetivo", "lens", "prime", "zoom"],
  tripode: ["tripod"],
  drone: ["dron"],
  gimbal: ["estabilizador"],

  // Gaming
  gaming: ["gamer", "game"],
  consola: ["console", "playstation", "ps4", "ps5", "xbox", "nintendo", "switch"],
  joystick: ["gamepad", "control", "mando"],

  // Peripherals
  teclado: ["keyboard", "mecanico", "mechanical keyboard"],
  mouse: ["raton", "mouse gamer"],
  mousepad: ["alfombrilla", "pad"],
  webcam: ["camara web", "camera web"],
  impresora: ["printer", "multifuncion", "plotter"],
  scanner: ["escaner"],

  // Components
  procesador: ["cpu", "ryzen", "intel core"],
  placa: ["gpu", "tarjeta grafica", "graphics card", "video"],
  ram: ["memoria", "memoria ram", "ddr4", "ddr5"],
  almacenamiento: ["ssd", "hdd", "disco", "disco duro", "unidad"],
  motherboard: ["placa madre", "mainboard"],
  cooler: ["ventilador", "fan", "liquid cooler", "aio", "refrigeracion"],
  fuente: ["psu", "fuente poder", "power supply"],
  gabinete: ["case", "chasis", "tower"],

  // Storage & media
  pendrive: ["usb", "flash drive", "pen drive"],
  microsd: ["sd", "tarjeta sd", "memoria sd"],

  // Networking & smart home
  router: ["modem", "wifi", "access point", "ap"],
  switch: ["switch ethernet"],
  nas: ["servidor", "storage server"],
  "camara seguridad": ["cctv", "ip camera", "camara ip"],
  domotica: ["smart home", "alexa", "google home", "homekit"],

  // Power & charging
  cargador: ["charger", "power adapter", "adaptador"],
  powerbank: ["bateria externa", "power bank"],
  ups: ["nobreak", "respaldo energia"],

  // Cables & hubs
  cable: ["usb c", "type c", "lightning", "hdmi", "displayport", "dp", "minijack", "aux"],
  hub: ["dock", "docking", "estacion", "dongle"],
  adaptador: ["converter"],
  splitter: ["duplicador"],

  // Wearables
  smartwatch: ["reloj inteligente", "watch", "smart watch"],
  watch: ["reloj", "smartwatch"],

  // Miscelánea + marcas
  funda: ["case", "cover"],
  "cargador auto": ["cargador para auto", "car charger"],
  vr: ["realidad virtual", "oculus", "meta quest", "htc vive"],
  airpods: ["auriculares", "earbuds", "tws"],
  playstation: ["ps5", "ps4", "consola", "gaming"],
  xbox: ["consola", "gaming"],
  nintendo: ["switch", "consola", "gaming"],
};

// Índice invertido liviano (para expandir por query)
const _inverseSyn = (() => {
  const map = new Map();
  const add = (a, b) => {
    if (!map.has(a)) map.set(a, new Set());
    map.get(a).add(b);
  };
  for (const [canon, list] of Object.entries(SYNONYMS)) {
    const c = normalize(canon);
    add(c, c);
    for (const term of list) {
      const t = normalize(term);
      add(c, t);
      add(t, c);
      for (const h of list) add(t, normalize(h));
    }
  }
  return map;
})();

function expandQuerySynonyms(queryNorm) {
  const tokens = tokenize(queryNorm);
  const bag = new Set();
  for (const tk of tokens) {
    if (_inverseSyn.has(tk)) {
      _inverseSyn.get(tk).forEach((v) => bag.add(v));
    } else {
      bag.add(tk);
    }
  }
  return bag;
}

// Ponderaciones
const SCORES = {
  exactTitle: 8,
  includesTitle: 5,
  includesMeta: 4,
  synTitle: 3,
  synMeta: 2,
  tokenOverlapTitle: 1,
  tokenOverlapMeta: 0.5,
};

export function getMatchScore(item, q) {
  const query = normalize(q ?? "");
  if (!query) return 0;

  const title = normalize(item.title ?? "");
  const brand = normalize(item.brand ?? "");
  const categoryNames = Array.isArray(item?.categories)
    ? item.categories
        .map((c) => (typeof c === "string" ? c : c?.name))
        .filter(Boolean)
    : [];
  const category = normalize(categoryNames.join(" "));
  const meta = `${brand} ${category}`.trim();

  if (title === query) return SCORES.exactTitle;

  let score = 0;

  if (title.includes(query)) score += SCORES.includesTitle;
  if (meta.includes(query)) score += SCORES.includesMeta;

  const syns = expandQuerySynonyms(query);
  if (syns.size) {
    for (const s of syns) {
      if (s && title.includes(s)) { score += SCORES.synTitle; break; }
    }
    for (const s of syns) {
      if (s && meta.includes(s)) { score += SCORES.synMeta; break; }
    }
  }

  // Overlap de tokens (multi‑palabra)
  const qTokens = tokenize(query);
  const tTokens = new Set(tokenize(title));
  const mTokens = new Set(tokenize(meta));
  let overlapTitle = 0;
  let overlapMeta = 0;

  for (const qt of qTokens) {
    if (tTokens.has(qt)) overlapTitle++;
    if (mTokens.has(qt)) overlapMeta++;
  }

  if (overlapTitle) score += overlapTitle * SCORES.tokenOverlapTitle;
  if (overlapMeta) score += overlapMeta * SCORES.tokenOverlapMeta;

  // Boost específico: queries “phone-ish” en categorías phones
  const PHONE_CATEGORIES = new Set(["phone", "smartphone", "mobile"]);
  const catTokens = tokenize(category);
  const isPhoneCat = catTokens.some((t) => PHONE_CATEGORIES.has(t));
  const phoneish = new Set(["celular","telefono","smartphone","iphone","android","celu","phone","phones","smartphones"]);
  const queryIsPhoneish =
      [...expandQuerySynonyms(query)].some((t) => phoneish.has(t));

  if (isPhoneCat && queryIsPhoneish) score += 1.5;

  // Bonus si pegó título + meta
  if (score >= (SCORES.includesTitle + SCORES.includesMeta)) score += 0.5;

  return Math.min(score, 12);
}

export default getMatchScore;
