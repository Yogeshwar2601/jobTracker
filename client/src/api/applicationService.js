import api from "./axios";

export const getApplications = async (params = {}) => {
    const response = await api.get("/applications", { params });
    return response.data;
};

export const getApplicationStats = async () => {
    const response = await api.get("/applications/stats");
    return response.data.stats;
};

export const createApplication = async (applicationData) => {
    const response = await api.post("/applications", applicationData);
    return response.data.application;
};

export const deleteApplication = async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
};

export const updateApplication = async (id, applicationData) => {
    const response = await api.put(`/applications/${id}`, applicationData);
    return response.data.application;
};