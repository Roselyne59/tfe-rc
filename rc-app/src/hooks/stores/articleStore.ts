import ArticlesAPI from "@/src/api/articles";
import { Article } from "@/src/types/api/Article";
import { create } from "zustand";

type ArticleStore = {
    articles: Article[];
    news: Article[];
    videos: Article[];
    loading: boolean;
    fetchArticles: () => Promise<void>;
    fetchNews: () => Promise<void>;
    fetchVideos: () => Promise<void>;
};

export const useArticleStore = create<ArticleStore>((set, get) => ({
    articles: [],
    news: [],
    videos: [],
    loading: false,

    // ✅ Récupère tous les articles (news + videos)
    fetchArticles: async () => {
        set({ loading: true });
        try {
            const data = await ArticlesAPI.getAll();
            set({ articles: data });
        } catch (err) {
            console.error("❌Erreur lors du chargement des articles:", err);
        } finally {
            set({ loading: false });
        }
    },

    // ✅ Récupère uniquement les news
    fetchNews: async () => {
        set({ loading: true });
        try {
            const data = await ArticlesAPI.getNews();
            set({ news: data });
        } catch (err) {
            console.error("❌Erreur lors du chargement des actualités:", err);
        } finally {
            set({ loading: false });
        }
    },

    // ✅ Récupère uniquement les vidéos (comme articles)
    fetchVideos: async () => {
        set({ loading: true });
        try {
            const data = await ArticlesAPI.getVideos();
            set({ videos: data });
        } catch (err) {
            console.error("❌Erreur lors du chargement des vidéos:", err);
        } finally {
            set({ loading: false });
        }
    },
}));