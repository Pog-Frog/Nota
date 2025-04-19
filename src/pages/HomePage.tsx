import { useCallback, useEffect, useRef, useState } from "react";
import BlogCard from "../components/BlogCard";
import CategoryCard from "../components/CategoryCard";
import CategorySection from "../components/CategorySection";
import FilterButton from "../components/FilterButton";
import HeroSection from "../components/HeroSection";
import RecentBlogsSection from "../components/RecentBlogsSection";
import Divider from "../components/ui/Divider";
import { Category } from "../interfaces/category.interface";
import { getAllCategories } from "../services/categoryService";
import { BlogPost } from "../interfaces/blog.interface";
import { getAllBlogPosts, getMoreBlogPosts } from "../services/blogService";
import InfiniteScroll from "react-infinite-scroll-component";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

const HomePage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const postsPerPage = 6;

    const [lastVisibleDoc, setLastVisibleDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
    const [errorBlogs, setErrorBlogs] = useState<string | null>(null);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    const fetchInitialBlogs = useCallback(async (categoryId: string | null = null) => {
        setIsLoadingBlogs(true);
        setErrorBlogs(null);
        setBlogs([]);
        setLastVisibleDoc(null);
        setHasMore(true);

        try {
            const { blogs: fetchedBlogs, lastVisibleDoc: newLastVisible } = await getAllBlogPosts({
                orderByField: "createdAt",
                orderDirection: "desc",
                limit: postsPerPage,
                categoryFilter: categoryId ?? undefined,
            });

            setBlogs(fetchedBlogs);
            setLastVisibleDoc(newLastVisible);
            setHasMore(fetchedBlogs.length === postsPerPage && newLastVisible !== null);

            console.log("inti blogs fetched:", fetchedBlogs.length, "has more:", fetchedBlogs.length === postsPerPage && newLastVisible !== null);
        } catch (error) {
            console.error("Error fetching initial posts:", error);
            setErrorBlogs("faled to load blog posts");
            setHasMore(false);
            setBlogs([]);
        } finally {
            setIsLoadingBlogs(false);
        }
    }, [postsPerPage]);

    const fetchMoreBlogs = useCallback(async () => {
        if (isLoadingBlogs || !hasMore || !lastVisibleDoc) {
            if (!lastVisibleDoc && hasMore) {
                console.log("end of data");
                setHasMore(false);
            }
            if (!hasMore) {
                console.log("fetchMoreBlogs called but hasMore is false");
            }
            return;
        }

        setIsLoadingBlogs(true);

        try {
            const { blogs: fetchedBlogs, lastVisibleDoc: newLastVisible } = await getMoreBlogPosts(lastVisibleDoc, {
                orderByField: "createdAt",
                orderDirection: "desc",
                limit: postsPerPage,
                categoryFilter: selectedCategory?.id ?? undefined,
            });

            setBlogs(prevBlogs => [...prevBlogs, ...fetchedBlogs]);
            setLastVisibleDoc(newLastVisible);
            setHasMore(fetchedBlogs.length === postsPerPage && newLastVisible !== null);

            console.log("More blogs fetched:", fetchedBlogs.length, "Has More:", fetchedBlogs.length === postsPerPage && newLastVisible !== null);
        } catch (error) {
            console.error("Error fetching more posts:", error);
            setErrorBlogs("failed to load more posts");
            setHasMore(false);
        } finally {
            setIsLoadingBlogs(false);
        }

    }, [isLoadingBlogs, hasMore, lastVisibleDoc, postsPerPage, selectedCategory]);

    const fetchCategories = useCallback(async () => {
        setIsLoadingCategories(true);
        try {
            const response = await getAllCategories();
            setCategories(response);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setIsLoadingCategories(false);
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        console.log("Selected category changed:", selectedCategory?.id);
        fetchInitialBlogs(selectedCategory?.id);
    }, [fetchInitialBlogs, selectedCategory]);


    const handleCategoryFilterClick = (category: Category | null) => {
        if (category?.id !== selectedCategory?.id || category === null && selectedCategory !== null) {
            setSelectedCategory(category);
        }
    };

    const handleNavigateToCategory = (category: Category) => {
        handleCategoryFilterClick(category);
        setTimeout(() => {
            const element = document.getElementById('recent-blogs');
            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    return (
        <div className="w-full relative overflow-hidden">
            <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-blue-500/20 dark:bg-blue-400/20 blur-3xl"></div>
            <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full bg-rose-500/20 dark:bg-rose-400/20 blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 relative">
                <HeroSection />

                <Divider />

                <div>
                    <div className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Read by Category
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="recent-blogs">
                        {/* {categories.slice(0, 3).map((category) => (
                            <button key={category.id} className="relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] group"
                                onClick={() => handleNavigateToCategory(category)}
                            >
                                <img
                                    className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
                                    src={category.image}
                                    alt={category.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-4 left-4">
                                    <div className="bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md">
                                        <span className="text-gray-900 dark:text-gray-100 text-sm font-semibold">
                                            {category.name}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))} */}

                        {isLoadingCategories ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl shadow-lg h-36"></div>
                            ))
                        ) : (
                            <>
                                {categories.slice(0, 3).map((category) => (
                                    <button key={category.id} className="relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] group hover:cursor-pointer"
                                        onClick={() => handleNavigateToCategory(category)}
                                    >
                                        <img
                                            className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
                                            src={category.image}
                                            alt={category.name}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute bottom-4 left-4">
                                            <div className="bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md">
                                                <span className="text-gray-900 dark:text-gray-100 text-sm font-semibold">
                                                    {category.name}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </>

                        )}
                    </div>

                    <div className="mt-16 py-8">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                            <div>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white relative inline-block">
                                    Recent Blogs
                                    <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
                                </h2>
                                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-lg">
                                    Your daily dose of diverse thinking. What topic shall we explore together?
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 py-2 w-full lg:w-auto overflow-x-auto lg:overflow-visible scrollbar-hide">
                                <div className="flex gap-2 pb-1">
                                    <button
                                        className={`px-4 py-2 h-auto min-w-fit whitespace-nowrap bg-slate-200/30 dark:bg-slate-50/10 rounded-full text-gray-800 dark:text-white text-sm font-semibold transform hover:scale-105 transition-all duration-200 ease-in-out hover:cursor-pointer hover:dark:bg-slate-50/20 hover:bg-slate-200/50 ${selectedCategory === null ? "bg-slate-300 dark:bg-slate-50/30" : ""
                                            }`}
                                        onClick={() => setSelectedCategory(null)}
                                    >
                                        All
                                    </button>
                                    {categories.slice(0, 5).map((category) => (
                                        <button key={category.id}
                                            className={`px-4 py-2 h-auto min-w-fit whitespace-nowrap bg-slate-200/30 dark:bg-slate-50/10 rounded-full text-gray-800 dark:text-white text-sm font-semibold transform hover:scale-105 transition-all duration-200 ease-in-out hover:cursor-pointer hover:dark:bg-slate-50/20 hover:bg-slate-200/50 ${selectedCategory?.id === category.id ? "bg-slate-300 dark:bg-slate-50/30" : ""
                                                }`}
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {isLoadingBlogs && blogs.length === 0 && !errorBlogs && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                {Array.from({ length: postsPerPage }).map((_, index) => (
                                    <div key={index} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md h-96">...</div>
                                ))}
                            </div>
                        )}

                        {!isLoadingBlogs && blogs.length === 0 && !errorBlogs && (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                <p>No blog posts found{selectedCategory?.name ? ` for this category` : ""}.</p>
                            </div>
                        )}

                        {/* <InfiniteScroll
                            dataLength={blogs.length}
                            next={fetchMoreBlogs}
                            hasMore={hasMore}
                            loader={
                                <div className="flex justify-center my-6">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            }
                            endMessage={
                                <div className="text-center mt-6 text-gray-500 dark:text-gray-400">
                                    <p>You've seen all the articles</p>
                                </div>
                            }
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 overflow-hidden">
                                {blogs.map((blog) => (
                                    <BlogCard key={blog.id} blog={blog} />
                                ))}
                            </div>
                        </InfiniteScroll> */}
                        {blogs.length > 0 && !errorBlogs && (
                            <InfiniteScroll
                                dataLength={blogs.length}
                                next={fetchMoreBlogs}
                                hasMore={hasMore}
                                loader={
                                    <div className="flex justify-center my-6">
                                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                }
                                endMessage={
                                    <div className="text-center mt-6 text-gray-500 dark:text-gray-400">
                                        <p>You've seen all the articles</p>
                                    </div>
                                }
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 overflow-hidden">
                                    {blogs.map((blog) => (
                                        <BlogCard key={blog.id} blog={blog} />
                                    ))}
                                </div>
                            </InfiniteScroll>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;