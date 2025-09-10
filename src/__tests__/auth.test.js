import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api/axios.js', () => {
    const api = { post: vi.fn() };
    return { api, default: api };
});

import { api } from '../api/axios.js';
import { login, register, verifyEmail, logout } from '../api/auth.js';

describe('auth api', () => {
    beforeEach(() => {
        api.post.mockReset();
        global.localStorage = {
            setItem: vi.fn(),
            getItem: vi.fn(),
            removeItem: vi.fn(),
        };
    });

    it('login stores token and returns data', async () => {
        const response = { data: { token: 'tok', user: { id: 1 } } };
        api.post.mockResolvedValue(response);
        const credentials = { email: 'a', password: 'b' };
        const res = await login(credentials);
        expect(api.post).toHaveBeenCalledWith('/auth/login', credentials);
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'tok');
        expect(res).toEqual({ token: 'tok', user: { id: 1 } });
    });

    it('register returns data without storing token', async () => {
        const response = { data: { token: 'tok', user: { id: 2 } } };
        api.post.mockResolvedValue(response);
        const payload = { email: 'a', password: 'b' };
        const res = await register(payload);
        expect(api.post).toHaveBeenCalledWith('/auth/register', payload);
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(res).toEqual({ token: 'tok', user: { id: 2 } });
    });

    it('verifyEmail returns token and user', async () => {
        const response = { data: { token: 'tok', user: { id: 3 } } };
        api.post.mockResolvedValue(response);
        const payload = { token: 'emailTok' };
        const res = await verifyEmail(payload);
        expect(api.post).toHaveBeenCalledWith('/auth/verify-email', payload);
        expect(res).toEqual({ token: 'tok', user: { id: 3 } });
    });

    it('logout posts and removes token', async () => {
        api.post.mockResolvedValue({ data: { success: true } });
        const res = await logout();
        expect(api.post).toHaveBeenCalledWith('/auth/logout');
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
        expect(res).toEqual({ success: true });
    });
});
