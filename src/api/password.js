// src/api/password.js
import { api } from "./axios";

export const requestPasswordReset = async (email) => {
    const res = await api.post("/password/request", { email });
    return res.data;
};

export const validateResetToken = async (email, token) => {
    const res = await api.post("/password/validate", { email, token });
    return res.data;
};

export const changePassword = async (email, token, newPassword) => {
    const res = await api.post("/password/change", { email, token, newPassword });
    return res.data;
};
