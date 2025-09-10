import { api } from "./axios";

export const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    const { bearer_token: token, user } = res.data;
    console.log("el token del login es", token);
    if (token) {
        localStorage.setItem("token", token);
    }
    return { token, user };
};

export const register = async (data) => {
    const res = await api.post("/auth/register", data);
    const { message } = res.data;
    return { message };
};

export const verifyEmail = async (data) => {
    const res = await api.post("/auth/verify-email", data);
    const { token, user } = res.data;
    return { token, user };
};

export const logout = async () => {
    const res = await api.post("/auth/logout");
    return res.data;
};

export const fetchCurrentUser = async () => {
    const res = await api.get("/auth/me");
    const { user } = res.data;
    return { user };
};
