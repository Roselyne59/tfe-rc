// ✅ Configuration centralisée des endpoints API
// Note: L'URL de base est désormais gérée dans api/client.ts
export const ENDPOINTS = {
    articles: "/articles",
    videos: "/videos", 
    news: "/news",
    login: "/auth/login",
    users: "/users",
    analyticsEvents: "/analytics/events",
    comments: "/comments",
};