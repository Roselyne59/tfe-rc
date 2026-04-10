// 📦 Exports centralisés de src/

// =============================================================================
// 🎭 TYPES
// =============================================================================
export * from './types/api/Article';
export * from './types/api/Auth';
export * from './types/api/News';
export * from './types/api/User';
export * from './types/api/Video';
export * from './types/api/Comment';

// Types theme
export * from './types/theme/Colors';
export * from './types/theme/Theme';

// =============================================================================
// 🗄️ STORES (State Management)
// =============================================================================
export { useArticleStore } from './hooks/stores/articleStore';
export { useAuthStore } from './hooks/stores/authStore';
export { useDataStore } from './hooks/stores/dataStore';
export { useModalStore } from './hooks/stores/modalStore';
export { useVideoStore } from './hooks/stores/videoStore';
export { useFavoritesStore } from './hooks/stores/favoritesStore';

// =============================================================================
// 🎣 HOOKS UTILITAIRES
// =============================================================================
export { useColorScheme } from './hooks/utils/useColorScheme';
export { useThemeColor } from './hooks/utils/useThemeColor';
export { useTrackArticle } from './hooks/utils/useTrackArticle';

// =============================================================================
// 📡 API LAYER
// =============================================================================
export { default as ArticlesAPI } from './api/articles';
export { default as AuthAPI } from './api/auth';
export { default as VideosAPI } from './api/videos';
export { default as AnalyticsAPI } from './api/analytics';

// Configuration API
export { default as apiClient, setAuthToken } from './api/client';
export { ENDPOINTS } from './api/Endpoints';

// =============================================================================
// 🧠 SERVICES (Business Logic)
// =============================================================================
export { ArticleService } from './services/articles.service';
export { AuthService } from './services/auth.service';
export { AnalyticsService } from './services/analytics.service';
export { CommentsService } from './services/comments.service';

// =============================================================================
// 📋 EXEMPLE D'USAGE
// =============================================================================
/*
// Avant (imports multiples)
import { useDataStore } from '@/src/hooks/stores/dataStore';
import { Article } from '@/src/types/api/Article';
import ArticlesAPI from '@/src/api/articles';

// Après (import centralisé)
import { useDataStore, Article, ArticlesAPI } from '@/src';
*/