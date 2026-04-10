import { ArticleService } from "@/src/services/articles.service";
import { Article } from "@/src/types/api/Article";

// ✅ API unifiée pour les articles basée sur ArticleService
export const ArticlesAPI = {
    // Récupère tous les articles
    getAll: async (): Promise<Article[]> => {
        return await ArticleService.getAll();
    },

    // Récupère uniquement les articles de type "news"
    getNews: async (): Promise<Article[]> => {
        const articles = await ArticleService.getAll();
        return articles.filter(article => article.type === "news");
    },

    // Récupère uniquement les articles de type "videos"
    getVideos: async (): Promise<Article[]> => {
        const articles = await ArticleService.getAll();
        return articles.filter(article => article.type === "videos");
    },

    // Récupère un article par ID (tous types confondus)
    getById: async (id: number): Promise<Article> => {
        return await ArticleService.getById(id);
    },
};

export default ArticlesAPI;