import { Comment } from "./Comment";
import { UserRef } from "./User";

export type ArticleType = "news" | "videos";

export interface Article {
    id: number;
    title: string;
    content: string;
    description: string;
    isActive: boolean;
    type: ArticleType;
    pictures?: string[];
    thumbnailUrl?: string;
    videoUrl?: string;
    createdAt: string;
    updatedAt: string;
    user?: UserRef;
    comments?: Comment[];
}



//Référence pour éviter les boucles d’import
export interface ArticleRef {
    id: number;
    title: string;
    type: "news" | "videos";
}