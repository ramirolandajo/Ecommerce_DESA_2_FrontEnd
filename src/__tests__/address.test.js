import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api/axios.js', () => {
  const api = { get: vi.fn(), post: vi.fn(), put: vi.fn() };
  return { api, default: api };
});

import { api } from '../api/axios.js';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../api/address.js';

describe('address api', () => {
  beforeEach(() => {
    api.get.mockReset();
    api.post.mockReset();
    api.put.mockReset();
    global.localStorage = { getItem: vi.fn() };
  });

  it('getAddresses normalizes description to array', async () => {
    const response = {
      data: [
        { id: 1, description: 'Main' },
        { id: 2, description: ['A', 'B'] },
      ],
    };
    api.get.mockResolvedValue(response);
    const res = await getAddresses();
    expect(api.get).toHaveBeenCalledWith('/user/addresses');
    expect(res).toEqual([
      { id: 1, description: ['Main'] },
      { id: 2, description: ['A', 'B'] },
    ]);
  });

  it('addAddress sends description string', async () => {
    api.post.mockResolvedValue({ data: { ok: true } });
    const res = await addAddress({ description: 'line' });
    expect(api.post).toHaveBeenCalledWith('/address', {
      description: 'line',
    });
    expect(res).toEqual({ ok: true });
  });

  it('updateAddress sends description string', async () => {
    api.put.mockResolvedValue({ data: { ok: true } });
    const res = await updateAddress(1, { description: 'foo' });
    expect(api.put).toHaveBeenCalledWith('/address/1', {
      description: 'foo',
    });
    expect(res).toEqual({ ok: true });
  });

  it('deleteAddress calls correct endpoint and returns success', async () => {
    api.delete = vi.fn().mockResolvedValue({ data: 'Dirección eliminada con éxito' });
    const res = await deleteAddress(1);
    expect(api.delete).toHaveBeenCalledWith('/address/1');
    expect(res).toBe('Dirección eliminada con éxito');
  });
});
