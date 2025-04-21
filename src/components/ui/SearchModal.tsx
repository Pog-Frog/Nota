import { motion } from "framer-motion";
import { FileText, Loader2, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Modal from "./Modal";
import { useDebounce } from "../../hooks/useDebounce";
import { useNavigate } from "react-router";
import { searchBlogPosts } from "../../services/blogService";
import { BlogPost } from "../../interfaces/blog.interface";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch?: (query: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const searchModalVariants = {
        hidden: {
            opacity: 0,
            y: -20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 400, damping: 25 }
        },
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    };

    const handleClose = () => {
        onClose();
        setSearchQuery("");
    };

    const performSearch = useCallback(async (query: string) => {
        if (query.trim().length < 2) { 
            setSearchResults([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const results = await searchBlogPosts(query);
            setSearchResults(results);
        } catch (err) {
            console.log(err);
            setError("Failed to perform search. Please try again.");
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        performSearch(debouncedSearchQuery);
    }, [debouncedSearchQuery, performSearch]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(searchQuery);
    };

    const handleResultClick = (blogId: string) => {
        navigate(`/blog/${blogId}`);
        handleClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <motion.div
                className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
                variants={searchModalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 px-3">
                            <Search className="text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for anything..."
                                className="flex-1 py-3 bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
                                autoFocus
                            />
                            <div className="flex items-center gap-2">
                                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-500 dark:text-gray-400">ESC</kbd>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <X size={18} className="text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="p-4 max-h-80 overflow-y-auto">
                        {isLoading && searchResults.length === 0 && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <Loader2 className="animate-spin inline-block mr-2" size={16} /> Searching...
                            </div>
                        )}
                        {error && (
                            <div className="text-center py-8 text-red-500 dark:text-red-400">
                                {error}
                            </div>
                        )}
                        {!isLoading && !error && debouncedSearchQuery.length > 0 && searchResults.length === 0 && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                                No results found for "{debouncedSearchQuery}"
                            </div>
                        )}
                        {!isLoading && !error && debouncedSearchQuery.length === 0 && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                                Start typing to search for blog posts (title, tags)...
                            </div>
                        )}
                        {!isLoading && !error && searchResults.length > 0 && (
                            <ul className="space-y-1">
                                {searchResults.map((blog) => (
                                    <li key={blog.id}>
                                        <button
                                            onClick={() => handleResultClick(blog.id)}
                                            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150"
                                        >
                                            <FileText size={18} className="text-gray-400 flex-shrink-0" />
                                            <span className="text-sm text-gray-800 dark:text-gray-200 truncate flex-grow">
                                                {blog.title}
                                            </span>
                                            {blog.categoryName && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded flex-shrink-0">
                                                    {blog.categoryName}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-end">
                        <div className="flex items-center gap-2">
                            <span>Press</span>
                            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">Enter</kbd>
                            <span>to select</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Modal>
    );
};

export default SearchModal;