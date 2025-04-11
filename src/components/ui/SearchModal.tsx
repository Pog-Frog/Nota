import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useState } from "react";
import Modal from "./Modal";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch?: (query: string) => void; 
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<unknown[]>([]); // TODO: Change

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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // TODO: Implement actual search functionality here
        console.log("Searching for:", searchQuery);
        setSearchResults([]); // Replace with actual search results
        setSearchQuery("");

        if (onSearch) {
            onSearch(searchQuery);
        }
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
                        {searchQuery.length > 0 ? (
                            searchResults.length > 0 ? (
                                <div className="space-y-2">
                                    {/* TODO: Replace with actual search results */}
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Search results will go here
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                                    No results found for "{searchQuery}"
                                </div>
                            )
                        ) : (
                            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                                Start typing to search...
                            </div>
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