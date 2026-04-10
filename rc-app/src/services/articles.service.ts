import apiClient from "@/src/api/client";
import { Article } from "@/src/types/api/Article";

export const ArticleService = {
    async getAll(): Promise<Article[]> {
        const { data } = await apiClient.get<Article[]>("/articles");
        return data;
    },

    async getAllNews(): Promise<Article[]> {
        const { data } = await apiClient.get<Article[]>("/news");
        return data;
    },

    async getAllVideos(): Promise<Article[]> {
        const { data } = await apiClient.get<Article[]>("/videos");
        return data;
    },

    async getById(id: number): Promise<Article> {
        const { data } = await apiClient.get<Article>(`/articles/${id}`);
        return data;
    },
};