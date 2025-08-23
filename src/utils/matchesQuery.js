export function matchesQuery(item, q) {
  const query = q?.toLowerCase().trim();
  if (!query) return true;
  const fields = [
    item.title,
    item.eyebrow,
    item.description,
    item.category,
    item.subcategory,
    item.id,
  ];
  return fields.some(
    (field) => typeof field === "string" && field.toLowerCase().includes(query)
  );
}
