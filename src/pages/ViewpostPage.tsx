import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router";
import { getBlogPostById } from "../services/blogService";
import { BlogPost } from "../interfaces/blog.interface";
import { toast } from "react-toastify";

const ViewPostPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<BlogPost | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await getBlogPostById(id!);
                
                if(response) {
                    setPost(response);
                }

                setLoading(false);
            } catch (error) {
                toast.error("Error fetching post. Please try again later.");
                console.error("Error fetching post:", error);
                setLoading(false);
                navigate("/");
            }
        };

        fetchPost();
    }, [id, navigate]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center px-4">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Post not found</h2>
                <Link to="/" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Return to home
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full relative overflow-hidden min-h-screen">
            <div className="fixed top-0 left-0 right-0 bottom-0 overflow-hidden -z-10">
                <div className="absolute top-1/4 -left-10 md:left-1/4 w-36 sm:w-64 md:w-80 lg:w-96 h-36 sm:h-64 md:h-80 lg:h-96 rounded-full bg-blue-500/10 dark:bg-blue-400/20 blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 -right-10 md:right-1/4 w-36 sm:w-64 md:w-80 lg:w-96 h-36 sm:h-64 md:h-80 lg:h-96 rounded-full bg-rose-500/10 dark:bg-rose-400/20 blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-amber-500/10 dark:bg-amber-400/20 blur-3xl animate-pulse" style={{ animationDelay: "3s" }}></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 lg:py-16 relative">
                <motion.div
                    className="mb-6 sm:mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <div className="mb-3">
                        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 shadow-sm">
                            {post.category}
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        {post.title}
                    </h1>

                    <div className="mt-3 sm:mt-4 flex items-center">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {post.authorName}
                            </p>
                            <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                                <span className="sm:ml-2">{post.createdAt.toDate().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {post.description && (
                        <p className="mt-3 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 italic border-l-4 border-indigo-500 pl-3 sm:pl-4 ml-0 sm:ml-1">
                            {post.description}
                        </p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7 }}
                    className="w-full h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent my-6 sm:my-8"
                ></motion.div>

                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="mb-6 sm:mb-8 rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg"
                >
                    <img
                        src={post.coverImage || "https://placehold.co/1200x630"}
                        alt={post.title}
                        className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                    />
                </motion.div>

                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    className="ql-editor prose dark:prose-invert prose-sm sm:prose-base md:prose-lg max-w-none prose-img:rounded-lg prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-indigo-600 dark:prose-a:text-indigo-400 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg mb-6 sm:mb-8 overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                ></motion.div>

                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    className="mb-6 sm:mb-8"
                >
                    <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                        Tags
                    </h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 shadow-sm hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors cursor-pointer"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                    className="flex justify-between items-center pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                    <Link to={`/edit/${post.id}`}>
                        <button
                            className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors text-sm sm:text-base"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 sm:mr-2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit Post
                        </button>
                    </Link>
                </motion.div>

                {/* Related Posts Section */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5 }}
                    className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700"
                >
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Related Posts</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Related Post Block */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="h-36 sm:h-48 overflow-hidden">
                                <img
                                    src="https://source.unsplash.com/random/800x600/?coding"
                                    alt="Related post"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-3 sm:p-4">
                                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Tech</span>
                                <h3 className="mt-1 text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                                    Getting Started with React Hooks
                                </h3>
                                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                    Learn how to use React's hooks API to build powerful, reusable components
                                </p>
                                <div className="mt-2 sm:mt-3 flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                    <span>April 10, 2025</span>
                                    <span className="mx-1 sm:mx-2">•</span>
                                    <span>4 min read</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="h-36 sm:h-48 overflow-hidden">
                                <img
                                    src="https://source.unsplash.com/random/800x600/?programming"
                                    alt="Related post"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-3 sm:p-4">
                                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Tech</span>
                                <h3 className="mt-1 text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                                    Getting Started with React Hooks
                                </h3>
                                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                    Learn how to use React's hooks API to build powerful, reusable components
                                </p>
                                <div className="mt-2 sm:mt-3 flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                    <span>April 10, 2025</span>
                                    <span className="mx-1 sm:mx-2">•</span>
                                    <span>4 min read</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default ViewPostPage;