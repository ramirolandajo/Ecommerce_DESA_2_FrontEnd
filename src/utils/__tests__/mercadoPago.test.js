import { describe, it, expect, vi, afterEach } from 'vitest';
import { createPreference } from '../mercadoPago.js';

describe('mercadoPago integration stub', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('posts items and returns sandbox init point on success', async () => {
    const items = [{ id: 1, title: 'test', quantity: 1, unit_price: 100 }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ sandbox_init_point: 'url123' }),
    });

    const url = await createPreference(items);
    expect(fetch).toHaveBeenCalledWith('/api/mp/create-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    expect(url).toBe('url123');
  });

  it('throws error when request fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(createPreference([])).rejects.toThrow('No se pudo crear la preferencia');
  });
});
