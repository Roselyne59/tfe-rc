import { ArticleRef } from "./Article";

export interface PictureNews {
    id: number;
    imageUrl: string;
}

export interface News {
    id: number;
    title: string;
    content: string;
    type: "news";
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    pictures: PictureNews[];
    article: ArticleRef;
}

export interface NewsRef {
    id: number;
    pictures: PictureNews[];
    type: "news";
}