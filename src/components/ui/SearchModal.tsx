import { motion } from "framer-motion";
import { FileText, Loader2, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { useDebounce } from "../../hooks/useDebounce";
import { useNavigate } from "react-router";
import { searchBlogPosts } from "../../services/blogService";
import { BlogPost } from "../../interfaces/blog.interface";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const navigate = useNavigate();
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsListRef = useRef<HTMLUListElement>(null);

    const searchModalVariants = {
        hidden: { opacity: 0, y: -20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } },
        exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }
    };

    const handleClose = useCallback(() => {
        onClose();
        setSearchQuery("");
        setSearchResults([]);
        setError(null);
        setIsLoading(false);
        setSelectedIndex(-1);
    }, [onClose]);

    const performSearch = useCallback(async (query: string) => {
        setSelectedIndex(-1);
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

    const handleResultClick = useCallback((blogId: string) => {
        navigate(`/blog/${blogId}`);
        handleClose();
    }, [navigate, handleClose]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
                return;
            }

            if (searchResults.length > 0) {
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    setSelectedIndex((prevIndex) =>
                        prevIndex >= searchResults.length - 1 ? 0 : prevIndex + 1
                    );
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    setSelectedIndex((prevIndex) =>
                        prevIndex <= 0 ? searchResults.length - 1 : prevIndex - 1
                    );
                } else if (event.key === 'Enter') {
                    if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
                        handleResultClick(searchResults[selectedIndex].id);
                    }
                }
            } else if (event.key === 'Enter') {
                event.preventDefault();
                performSearch(searchQuery);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, searchResults, selectedIndex, handleClose, handleResultClick, performSearch, searchQuery]);


    useEffect(() => {
        if (selectedIndex < 0 || !resultsListRef.current) return;

        const listElement = resultsListRef.current;
        const selectedItem = listElement.querySelector(`[data-index="${selectedIndex}"]`) as HTMLLIElement;


        if (selectedItem) {
            selectedItem.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [selectedIndex]);


    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <motion.div
                className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
                variants={searchModalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 px-3">
                            <Search className="text-gray-400" size={20} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search blog posts..."
                                className="flex-1 py-3 bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
                            />
                            <div className="flex items-center gap-2">
                                {isLoading && <Loader2 size={18} className="animate-spin text-gray-400" />}
                                <kbd className="hidden sm:inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-500 dark:text-gray-400">ESC</kbd>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <X size={18} className="text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>
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
                        {!isLoading && !error && debouncedSearchQuery.length === 0 && !searchQuery && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                                Start typing to search for blog posts (title, tags)...
                            </div>
                        )}
                        {!isLoading && !error && searchResults.length > 0 && (
                            <ul ref={resultsListRef} className="space-y-1">
                                {searchResults.map((blog, index) => (
                                    <li
                                        key={blog.id}
                                        data-index={index}
                                        aria-selected={selectedIndex === index}
                                    >
                                        <button
                                            onClick={() => handleResultClick(blog.id)}
                                            className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-150 focus:outline-none ${selectedIndex === index
                                                    ? 'bg-blue-100 dark:bg-blue-800/60 ring-2 ring-blue-500 ring-opacity-50'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                                }`}
                                        >
                                            <FileText size={18} className={`flex-shrink-0 ${selectedIndex === index ? 'text-blue-700 dark:text-blue-300' : 'text-gray-400'}`} />
                                            <span className={`text-sm truncate flex-grow ${selectedIndex === index ? 'text-blue-900 dark:text-blue-100 font-medium' : 'text-gray-800 dark:text-gray-200'}`}>
                                                {blog.title}
                                            </span>
                                            {blog.categoryName && (
                                                <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${selectedIndex === index ? 'bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
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
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">↑</kbd>
                                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">↓</kbd>
                                <span>to navigate</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">Enter</kbd>
                                <span>to select</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Modal>
    );
};

export default SearchModal;