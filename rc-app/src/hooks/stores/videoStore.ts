import VideosAPI from "@/src/api/videos";
import { Video } from "@/src/types/api/Video";
import { create } from "zustand";

type VideoStore = {
    videos: Video[];
    loading: boolean;
    fetchVideos: () => Promise<void>;
};

export const useVideoStore = create<VideoStore>((set) => ({
    videos: [],
    loading: false,

    // ✅ Récupère les vidéos via la nouvelle API unifiée
    fetchVideos: async () => {
        set({ loading: true });
        try {
            const data = await VideosAPI.getAll();
            set({ videos: data });
        } catch (err) {
            console.error("❌Erreur lors du chargement des vidéos:", err);
        } finally {
            set({ loading: false });
        }
    },
}));