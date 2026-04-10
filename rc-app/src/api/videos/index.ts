import { ArticleService } from "@/src/services/articles.service";
import { Article } from "@/src/types/api/Article";
import { Video } from "@/src/types/api/Video";

// ✅ API pour les vidéos basée sur ArticleService unifié
export const VideosAPI = {
    // Récupère tous les articles de type "videos" et les convertit en format Video
    getAll: async (): Promise<Video[]> => {
        const articles = await ArticleService.getAll();
        
        // Filtrer et transformer les articles de type "videos"
        return articles
            .filter(article => article.type === "videos")
            .map(article => transformArticleToVideo(article));
    },

    // Récupère une vidéo par ID
    getById: async (id: number): Promise<Video> => {
        const article = await ArticleService.getById(id);
        
        // Vérifier que c'est bien un article de type "videos"
        if (article.type !== "videos") {
            throw new Error(`L'article ${id} n'est pas une vidéo`);
        }
        
        return transformArticleToVideo(article);
    },
};

// ✅ Fonction utilitaire pour transformer Article en Video
function transformArticleToVideo(article: Article): Video {
    return {
        id: article.id,
        title: article.title,
        description: article.description || "Vidéo des réseaux sociaux",
        thumbnailUrl: article.thumbnailUrl || article.pictures?.[0] || "",
        videoUrl: article.videoUrl || "",
        createdAt: article.createdAt,
        uploadedAt: article.updatedAt,
        type: "videos",
        article: {
            id: article.id,
            title: article.title,
            type: article.type
        }
    };
}

export default VideosAPI;