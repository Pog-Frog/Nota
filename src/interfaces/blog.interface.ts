import { Timestamp } from "firebase/firestore";

export interface Blog {
    title: string;
    categoryId: string; 
    categoryName: string; 
    description?: string;
    content: string;
    tags: string[];
    coverImage?: string | null;
    authorId: string;
    authorName?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface BlogPost extends Blog {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}