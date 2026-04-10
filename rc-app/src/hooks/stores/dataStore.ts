import { ArticleService } from "@/src/services/articles.service";
import { Article } from "@/src/types/api/Article";
import { create } from "zustand";

type DataStore = {
    articles: Article[];   // Tous les articles
    news: Article[];       // Articles de type "news"
    videos: Article[];     // Articles de type "videos"
    loading: boolean;
    fetchAll: () => Promise<void>;
    fetchNews: () => Promise<void>;
    fetchVideos: () => Promise<void>;
};

export const useDataStore = create<DataStore>((set) => ({
    news: [],
    articles: [],
    videos: [],
    loading: false,

    fetchAll: async () => {
        set({ loading: true });
        try {
            const allArticles = await ArticleService.getAll();

            // ✅ Séparer news et vidéos
            const newsItems = allArticles.filter((item: Article) => item.type === "news");
            const videoItems = allArticles.filter((item: Article) => item.type === "videos");

            // ✅ Stocker dans le store
            set({
                articles: allArticles,   // Tous les articles
                news: newsItems,         // uniquement news
                videos: videoItems,      // uniquement vidéos
                loading: false,
            });
        } catch (err) {
            console.error("❌ Erreur chargement global :", err);
            set({ loading: false });
        }
    },

    fetchNews: async () => {
        set({ loading: true });
        try {
            const newsItems = await ArticleService.getAllNews();
            set({ news: newsItems, loading: false });
        } catch (err) {
            console.error("❌ Erreur chargement articles :", err);
            set({ loading: false });
        }
    },

    fetchVideos: async () => {
        set({ loading: true });
        try {
            const videoItems = await ArticleService.getAllVideos();
            set({ videos: videoItems, loading: false });
        } catch (err) {
            console.error("❌ Erreur chargement vidéos :", err);
            set({ loading: false });
        }
    },
}));