import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://ecommerce-desa-2-backend.onrender.com/",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("[axios interceptor] token:", token);
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("[axios interceptor] headers:", config.headers);
    return config;
});

export const request = {
    get: (url, config) => api.get(url, config),
    post: (url, data, config) => api.post(url, data, config),
    put: (url, data, config) => api.put(url, data, config),
    delete: (url, config) => api.delete(url, config),
};

export default api;
