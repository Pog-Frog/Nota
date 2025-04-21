import { Link } from "react-router";
import { BlogPost } from "../interfaces/blog.interface";
import { useEffect, useState } from "react";
import { Category } from "../interfaces/category.interface";
import { getCategoryById } from "../services/categoryService";

interface BlogCardProps {
    blog: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {

    const TAG_COLORS = [
        "bg-amber-500/90",
        "bg-emerald-500/90",
        "bg-indigo-500/90",
    ];

    const [category, setCategory] = useState<Category | null>(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const category = await getCategoryById(blog.categoryId);

                setCategory(category);
            } catch (error) {
                console.error("Error fetching category:", error);
            }
        }

        fetchCategory();
    }, [blog.categoryId]);


    return (
        <Link to={`/blog/${blog.id}`} className="flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] bg-white dark:bg-black border border-gray-200/30 dark:border-gray-700/30 h-full group">
            <div className="relative w-full h-56 overflow-hidden hover:cursor-pointer">
                <img
                    className="w-fit h-fit object-cover transition-transform duration-500 group-hover:scale-105"
                    src={blog.coverImage || category?.image || "https://placehold.co/392x220.png?text=No+Image"}
                    alt="Blog post thumbnail"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>

                {blog.tags && blog.tags.length > 0 && (
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                        {blog.tags.slice(0, 2).map((tag, index) => (
                            <div
                                key={tag}
                                className={`px-3 py-1.5 ${TAG_COLORS[index]} backdrop-blur-sm rounded-md shadow-md transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300`}
                                style={{ transitionDelay: `${index * 75}ms` }}
                            >
                                <span className="text-white text-xs font-medium">{tag}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col gap-4 flex-grow">
                <h3 className="text-xl font-bold text-start text-gray-900 dark:text-white leading-relaxed group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 hover:cursor-pointer">
                    {blog.title}
                </h3>

                <p className="text-gray-600 text-start dark:text-gray-300 text-base line-clamp-3 flex-grow">
                    {blog.description!.length > 100 ? blog.description!.slice(0, 100) + "..." : blog.description}
                </p>

                <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full my-1"></div>

                <div className="flex items-center mt-auto select-none">
                    <div className="ml-3 flex items-center text-sm">
                        <span className="font-semibold text-gray-900 dark:text-gray-200">{blog.authorName}</span>
                        <span className="mx-2 text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-gray-500 dark:text-gray-400">{blog.createdAt!.toDate().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;