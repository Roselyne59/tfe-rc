import { ArticleRef } from "./Article";
import { UserRef } from "./User";

export type ActorType = "actor" | "director";

export interface Video {
    id: number;
    title: string;
    description?: string;
    thumbnailUrl: string;
    videoUrl: string; // Lien vers TikTok, YouTube, etc.
    createdAt: string;
    uploadedAt: string; 
    type: "videos";
    article?: ArticleRef;
    actors?: VideoActor[];
}

export interface VideoRef {
    id: number;
    thumbnailUrl: string;
    type: "videos";
}

export interface VideoActor {
    id: number;
    actor: UserRef;
    role: ActorType;
}