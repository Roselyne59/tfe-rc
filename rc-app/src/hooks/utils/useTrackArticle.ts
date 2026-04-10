import { useEffect, useRef } from "react";
import { AnalyticsService } from "@/src/services/analytics.service";

/**
 * Hook de tracking pour les écrans de détail article/vidéo.
 * Enregistre automatiquement un événement "view" au montage,
 * et un événement "read_time" au démontage avec la durée de lecture.
 *
 * @param articleId - ID de l'article ou vidéo
 * @param type - "article" ou "video"
 */
export function useTrackArticle(articleId: number | null, type: "article" | "video") {
    const startTime = useRef<number>(0);
    const tracked = useRef(false);

    useEffect(() => {
        if (!articleId || tracked.current) return;

        tracked.current = true;
        startTime.current = Date.now();

        // Enregistrer la vue
        const viewEvent = type === "article" ? "article_view" : "video_view";
        AnalyticsService.trackEvent(viewEvent, articleId);

        // Au démontage : enregistrer le temps de lecture
        return () => {
            const durationSec = Math.round((Date.now() - startTime.current) / 1000);
            if (durationSec > 0) {
                const readTimeEvent = type === "article" ? "article_read_time" : "video_read_time";
                AnalyticsService.trackEvent(readTimeEvent, articleId, {
                    duration: durationSec,
                });
            }
        };
    }, [articleId, type]);
}
