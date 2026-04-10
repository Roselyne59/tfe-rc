import apiClient from "@/src/api/client";
import { ENDPOINTS } from "@/src/api/Endpoints";

export type AnalyticsEventDto = {
    eventType: string;
    articleId: number;
    anonymousId: string;
    duration?: number;
    metadata?: Record<string, any>;
};

export const AnalyticsAPI = {
    sendEvents: async (events: AnalyticsEventDto[]): Promise<void> => {
        await apiClient.post(ENDPOINTS.analyticsEvents, { events });
    },
};

export default AnalyticsAPI;
