export function getMatchScore(item, q) {
  const query = q?.toLowerCase().trim();
  if (!query) return 0;

  const title = item.title?.toLowerCase() ?? "";
  const brand = item.brand?.toLowerCase() ?? "";
  const category = item.category?.toLowerCase() ?? "";

  if (title === query) return 4;
  if (title.includes(query)) return 3;
  if (brand.includes(query) || category.includes(query)) return 2;

  const synonymsMap = {
    celular: ["telefono", "movil", "smartphone"],
    telefono: ["celular", "movil", "smartphone"],
    movil: ["telefono", "celular", "smartphone"],
    smartphone: ["telefono", "celular", "movil"],
    laptop: ["notebook", "portatil"],
    notebook: ["laptop", "portatil"],
    portatil: ["laptop", "notebook"],
    television: ["tv", "pantalla"],
    tv: ["television", "pantalla"],
    pantalla: ["television", "tv"],
  };

  const synonyms = synonymsMap[query];
  if (synonyms) {
    if (synonyms.some((syn) => title.includes(syn))) return 1;
    if (synonyms.some((syn) => brand.includes(syn) || category.includes(syn))) return 1;
  }

  return 0;
}
