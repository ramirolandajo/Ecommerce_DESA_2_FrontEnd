import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock axios and test axios-based helpers
vi.mock('axios', () => {
  return { default: { create: vi.fn() }, create: vi.fn() };
});
import axios from 'axios';

describe('api/axios.js', () => {
  let request, api, mockInstance, requestInterceptor;

  beforeEach(async () => {
    mockInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      defaults: { baseURL: 'http://localhost:3000/api', headers: {} },
      interceptors: {
        request: {
          use: vi.fn((fn) => {
            requestInterceptor = fn;
          }),
        },
      },
    };
    axios.create.mockReturnValue(mockInstance);
    vi.resetModules();
    ({ request, api } = await import('../api/axios.js'));
  });

  it('initializes axios instance with base URL', () => {
    expect(api.defaults.baseURL).toBe('http://localhost:3000/api');
  });

  it('performs GET request and forwards headers', async () => {
    const response = { data: { ok: true } };
    const config = { headers: { Authorization: 'Bearer token' } };
    mockInstance.get.mockResolvedValue(response);

    const res = await request.get('/test', config);
    expect(mockInstance.get).toHaveBeenCalledWith('/test', config);
    expect(res).toEqual(response);
  });

  it('propagates errors from axios', async () => {
    const error = new Error('Network error');
    mockInstance.get.mockRejectedValue(error);

    await expect(request.get('/fail')).rejects.toThrow('Network error');
  });

  it('adds Authorization header when token is present', () => {
    global.localStorage = { getItem: vi.fn().mockReturnValue('abc123') };
    const config = { headers: {} };
    const result = requestInterceptor(config);
    expect(result.headers.Authorization).toBe('Bearer abc123');
  });
});
