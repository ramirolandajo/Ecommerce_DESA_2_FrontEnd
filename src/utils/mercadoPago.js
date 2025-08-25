export async function createPreference(items) {
  const res = await fetch('/api/mp/create-preference', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ items })
  });
  if (!res.ok) {
    throw new Error('Failed to create preference');
  }
  const data = await res.json();
  return data.sandbox_init_point;
}
