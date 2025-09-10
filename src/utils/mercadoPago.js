export async function createPreference(items) {
  const res = await fetch('/api/mp/create-preference', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ items })
  });
  if (!res.ok) {
    throw new Error('No se pudo crear la preferencia');
  }
  const data = await res.json();
  return data.sandbox_init_point;
}
