import api from "./axios";

export const registerUser = async (userData) => {
    const response = await api.post("/auth/register", userData);

    localStorage.setItem("jobtrack_token", response.data.token);
    localStorage.setItem("jobtrack_user", JSON.stringify(response.data.user));

    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    localStorage.setItem("jobtrack_token", response.data.token);
    localStorage.setItem("jobtrack_user", JSON.stringify(response.data.user));

    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem("jobtrack_token");
    localStorage.removeItem("jobtrack_user");
};

export const getStoredUser = () => {
    const user = localStorage.getItem("jobtrack_user");

    return user ? JSON.parse(user) : null;
};