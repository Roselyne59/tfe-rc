import apiClient from "@/src/api/client";
import { Comment } from "@/src/types/api/Comment";

export const CommentsService = {
    async getByArticle(articleId: number): Promise<Comment[]> {
        const { data } = await apiClient.get<Comment[]>(`/comments/article/${articleId}`);
        return data;
    },

    async create(articleId: number, author: string, content: string): Promise<Comment> {
        const { data } = await apiClient.post<Comment>("/comments", {
            articleId,
            author,
            content,
        });
        return data;
    },

    async update(id: number, content: string): Promise<Comment> {
        const { data } = await apiClient.patch<Comment>(`/comments/${id}`, { content });
        return data;
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/comments/${id}`);
    },
};
