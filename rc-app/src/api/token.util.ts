import apiClient from "./client";

export const setAuthToken = (token?: string) => {
    if (token) {
        apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.Authorization;
    }
};