// src/utils/getQueryScore.js
import getMatchScore, { normalize, tokenize } from "./getMatchScore.js";

/**
 * Wrapper para mantener compat con código viejo.
 * Hoy delega en getMatchScore; si querés, podés sumar extras suaves
 * por campos secundarios (eyebrow, description, id).
 */
export function getQueryScore(item, q) {
  const base = getMatchScore(item, q);
  if (base <= 0) return 0;

  // Opcional: micro bonus por presencia en eyebrow/description/id
  const query = normalize(q ?? "");
  const extraFields = [item.eyebrow, item.description, item.id].filter(Boolean).map(normalize);
  const hasAny = extraFields.some((f) => f.includes(query));

  return hasAny ? Math.min(base + 0.5, 12) : base;
}

export default getQueryScore;
