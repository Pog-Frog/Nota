import {
    collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy, limit, serverTimestamp, startAfter,
    QueryDocumentSnapshot,
    DocumentData
} from "firebase/firestore";
import { db } from "../api/firebase";
import { Blog, BlogPost } from "../interfaces/blog.interface";

const COLLECTION_NAME = "blogs";

interface QueryOptions {
    categoryFilter?: string;
    limit?: number;
    orderByField?: string;
    orderDirection?: "asc" | "desc";
}

interface PaginatedBlogResponse {
    blogs: BlogPost[];
    lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null;
}


export const createBlogPost = async (blogData: Omit<Blog, 'createdAt' | 'updatedAt' | 'id'>): Promise<string | undefined> => {
    if (!blogData.authorId) {
        throw new Error("Author ID is missing. User must be logged in to create a post.");
    }

    if (!blogData.categoryId) {
        throw new Error("Category ID is missing. A category must be selected.");
    }

    if (!blogData.categoryName) {
        throw new Error("Category Name is missing, but proceeding with Category ID.");
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

export const getAllBlogPosts = async (options: QueryOptions = {}): Promise<PaginatedBlogResponse> => {
    try {
        const { categoryFilter, limit: queryLimit = 50, orderByField = "createdAt", orderDirection = "desc" } = options;

        const constraints = [];

        if (categoryFilter) {
            constraints.push(where("categoryId", "==", categoryFilter));
        }

        constraints.push(orderBy(orderByField, orderDirection));
        constraints.push(limit(queryLimit));

        const q = query(collection(db, COLLECTION_NAME), ...constraints);

        const querySnapshot = await getDocs(q);
        const blogs: BlogPost[] = [];

        querySnapshot.forEach((doc) => {
            blogs.push({ id: doc.id, ...doc.data() } as BlogPost);
        });

        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        return {
            blogs: blogs,
            lastVisibleDoc: lastVisible || null,
        }
    } catch (error) {
        console.error("Error getting blog posts:", error);
        throw error;
    }
};

export const updateBlogPost = async (id: string, blogData: Partial<Omit<Blog, 'id' | 'authorId' | 'createdAt'>>): Promise<void> => {
    // **Note: ** Cannot change authorId and createdAt :(
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

export const getMoreBlogPosts = async (
    lastVisible: QueryDocumentSnapshot<DocumentData> | null,
    options: QueryOptions = {}
): Promise<PaginatedBlogResponse> => {
    if (!lastVisible) {
        console.log("No lastVisible document provided to getMoreBlogPosts, returning empty.");
        return { blogs: [], lastVisibleDoc: null };
    }

    try {
        const { categoryFilter, limit: queryLimit = 6, orderByField = "createdAt", orderDirection = "desc" } = options;

        const constraints = [];
        if (categoryFilter) {
            constraints.push(where("categoryId", "==", categoryFilter));
        }
        constraints.push(orderBy(orderByField, orderDirection));

        constraints.push(startAfter(lastVisible));

        constraints.push(limit(queryLimit));

        const q = query(collection(db, COLLECTION_NAME), ...constraints);
        const querySnapshot = await getDocs(q);

        const blogs: BlogPost[] = [];
        querySnapshot.forEach((doc) => {
            blogs.push({ id: doc.id, ...doc.data() } as BlogPost);
        });

        const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        return {
            blogs: blogs,
            lastVisibleDoc: newLastVisible || null
        };
    } catch (error) {
        console.error("Error getting more blog posts:", error);
        throw error;
    }
};

export const searchBlogPosts = async (searchQuery: string, queryLimit: number = 10): Promise<BlogPost[]> => {
    if (!searchQuery || searchQuery.trim() === "") {
        return [];
    }
    
    const titleQuery = query(
        collection(db, COLLECTION_NAME),
        where("title", ">=", searchQuery),
        where("title", "<=", searchQuery + '\uf8ff'),
        orderBy("title"), 
        limit(queryLimit)
    );

    const tagQuery = query(
        collection(db, COLLECTION_NAME),
        where("tags", "array-contains", searchQuery),
        orderBy("createdAt", "desc"),
        limit(queryLimit)
    );

    try {
        console.log(`searching for titles startting with: "${searchQuery}"`);
        const titleSnapshot = await getDocs(titleQuery);
        const blogs: BlogPost[] = [];
        const foundIds = new Set<string>(); 

        titleSnapshot.forEach((doc) => {
            if (!foundIds.has(doc.id)) {
                blogs.push({ id: doc.id, ...doc.data() } as BlogPost);
                foundIds.add(doc.id);
            }
        });

        console.log(`tags search exact: "${searchQuery}"`);
        const tagSnapshot = await getDocs(tagQuery);
        tagSnapshot.forEach((doc) => {
            if (!foundIds.has(doc.id)) { 
                blogs.push({ id: doc.id, ...doc.data() } as BlogPost);
                foundIds.add(doc.id);
            }
        });

        blogs.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
        const finalBlogs = blogs.slice(0, queryLimit);

        return finalBlogs;

    } catch (error) {
        console.error(`eror searching  for "${searchQuery}":`, error);
        throw error;
    }
};