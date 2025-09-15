import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    const publicRoutes = ["/login", "/register", "/verify-email"];
    const currentPath = window.location.pathname;
    if (!token && !publicRoutes.includes(currentPath)) {
        window.location.href = "/login";
        return Promise.reject("No token, redirigiendo al login");
    }
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        console.log("[axios interceptor] headers:", config.headers);
    }
    return config;
});

export const request = {
    get: (url, config) => api.get(url, config),
    post: (url, data, config) => api.post(url, data, config),
    put: (url, data, config) => api.put(url, data, config),
    delete: (url, config) => api.delete(url, config),
};

export default api;
