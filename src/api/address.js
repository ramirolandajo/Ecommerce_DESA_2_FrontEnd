import { api } from "./axios";

const handleError = (error) => {
  const err = error?.response?.data || { message: error.message };
  throw err;
};

export const getAddresses = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("[getAddresses] token:", token);
    const res = await api.get("/user/addresses");
    console.log("[getAddresses] response:", res);
    // Ensure description is always an array of strings
    return res.data.map((a) =>
      Array.isArray(a.description) ? a : { ...a, description: [a.description] }
    );
  } catch (error) {
    console.error("[getAddresses] error:", error, error?.response);
    handleError(error);
  }
};

// Backend expects `description` as an array of strings
export const addAddress = async (data) => {
  try {
    // Enviar description como string, no array
    const payload = {
      ...data,
      description: typeof data.description === "string"
        ? data.description
        : Array.isArray(data.description)
          ? data.description.join(" ")
          : String(data.description),
    };
    const res = await api.post("/address", payload);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// Backend expects `description` as an array of strings
export const updateAddress = async (id, data) => {
  try {
    // Enviar description como string, no array
    const payload = {
      ...data,
      description: typeof data.description === "string"
        ? data.description
        : Array.isArray(data.description)
          ? data.description.join(" ")
          : String(data.description),
    };
    const res = await api.put(`/address/${id}`, payload);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteAddress = async (id) => {
  try {
    const res = await api.delete(`/address/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export default {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
