import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { db } from "../api/firebase";
import { Blog, BlogPost } from "../interfaces/blog.interface";

const COLLECTION_NAME = "blogs";

interface QueryOptions {
    categoryFilter?: string;
    limit?: number;
    orderByField?: string;
    orderDirection?: "asc" | "desc";
}


export const createBlogPost = async (blogData: Omit<Blog, 'createdAt' | 'updatedAt' | 'id'>): Promise<string | undefined> => {
    if (!blogData.authorId) {
        throw new Error("Author ID is missing. User must be logged in to create a post.");
    }

    try {
        const blogWithTimestamp = {
            ...blogData,
            coverImage: blogData.coverImage !== undefined ? blogData.coverImage : null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, COLLECTION_NAME), blogWithTimestamp);
        console.log("Blog post created with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error creating blog post:", error);
        console.error("Data sent:", blogData);
    }
};

export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as BlogPost;
        } else {
            console.warn(`Blog post with ID ${id} not found.`);
            return null;
        }
    } catch (error) {
        console.error(`Error getting blog post ${id}:`, error);
        throw error;
    }
};

export const getAllBlogPosts = async (options: QueryOptions = {}): Promise<BlogPost[]> => {
    try {
        const { categoryFilter, limit: queryLimit = 50, orderByField = "createdAt", orderDirection = "desc" } = options;

        const constraints = [];

        if (categoryFilter) {
            constraints.push(where("category", "==", categoryFilter));
        }

        constraints.push(orderBy(orderByField, orderDirection));
        constraints.push(limit(queryLimit));

        const q = query(collection(db, COLLECTION_NAME), ...constraints);

        const querySnapshot = await getDocs(q);
        const blogs: BlogPost[] = [];

        querySnapshot.forEach((doc) => {
            blogs.push({ id: doc.id, ...doc.data() } as BlogPost);
        });

        return blogs;
    } catch (error) {
        console.error("Error getting blog posts:", error);
        throw error;
    }
};

export const updateBlogPost = async (id: string, blogData: Partial<Omit<Blog, 'id' | 'authorId' | 'createdAt'>>): Promise<void> => {
    // **Note:** Rules should prevent changing authorId and createdAt
    try {
        const docRef = doc(db, COLLECTION_NAME, id);

        const blogWithTimestamp = {
            ...blogData,
            updatedAt: serverTimestamp()
        };

        await updateDoc(docRef, blogWithTimestamp);
        console.log("Blog post updated successfully:", id);
    } catch (error) {
        console.error(`Error updating blog post ${id}:`, error);
        console.error("Data sent for update:", blogData);
        throw error;
    }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
        console.log("Blog post deleted successfully:", id);
    } catch (error) {
        console.error(`Error deleting blog post ${id}:`, error);
        throw error;
    }
};

export const getBlogPostsByTag = async (tag: string): Promise<BlogPost[]> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("tags", "array-contains", tag),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const blogs: BlogPost[] = [];

        querySnapshot.forEach((doc) => {
            blogs.push({ id: doc.id, ...doc.data() } as BlogPost);
        });

        return blogs;
    } catch (error) {
        console.error(`Error getting blog posts by tag "${tag}":`, error);
        throw error;
    }
};