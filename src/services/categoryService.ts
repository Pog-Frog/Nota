import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../api/firebase";
import { Category } from "../interfaces/category.interface";

const COLLECTION_NAME = "categories";

export const getAllCategories = async (): Promise<Category[]> => {
    try {
        const categoriesCollectionRef = collection(db, COLLECTION_NAME);
        const q = query(categoriesCollectionRef, orderBy("name", "asc"));

        const querySnapshot = await getDocs(q);
        const categories: Category[] = [];

        querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() } as Category);
        });

        return categories;
    } catch (error) {
        console.error("Error getting categories:", error);
        throw error;
    }
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
    if (!id) {
        return null;
    }
    
    try {
        const docRef = doc(db, COLLECTION_NAME, id);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Category;
        } else {
            console.warn(`Category with ID ${id} not found.`);
            return null;
        }
    } catch (error) {
        console.error(`Error getting category ${id}:`, error);
        throw error;
    }
};