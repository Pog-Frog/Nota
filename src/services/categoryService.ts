import { collection, getDocs, orderBy, query } from "firebase/firestore";
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
