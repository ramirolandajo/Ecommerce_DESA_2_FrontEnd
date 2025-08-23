const SYNONYMS = {
  mac: ["apple", "notebook", "laptop"],
  apple: ["mac", "notebook", "laptop", "iphone"],
  notebook: ["laptop", "mac", "apple"],
  laptop: ["notebook", "mac", "apple"],
  iphone: ["apple", "smartphone"],
  smartphone: ["iphone", "apple"],
};

export function getQueryScore(item, q) {
  const query = q?.toLowerCase().trim();
  if (!query) return 1;

  const fields = [
    item.title,
    item.eyebrow,
    item.description,
    item.category,
    item.subcategory,
    item.brand,
    item.id,
  ];

  let score = 0;
  const related = SYNONYMS[query] || [];

  for (const field of fields) {
    if (typeof field !== "string") continue;
    const value = field.toLowerCase();
    if (value.startsWith(query)) {
      score = Math.max(score, 3);
    } else if (value.includes(query)) {
      score = Math.max(score, 2);
    }
    for (const rel of related) {
      if (value.includes(rel)) {
        score = Math.max(score, 1);
      }
    }
  }

  return score;
}

export default getQueryScore;

