import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import Tooltip from "./Tooltip";

interface SearchButtonProps {
    onClick: () => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const searchButtonVariants = {
        hover: {
            scale: 1.1,
            transition: { type: "spring", stiffness: 400, damping: 10 }
        },
        tap: {
            scale: 0.95
        }
    };

    return (
        <motion.div
            className="relative ml-2"
            variants={searchButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <button
                onClick={onClick}
                className="flex items-center gap-2 px-8 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                <Search size={18} />
                <span className="text-sm">Search</span>
                <div className="hidden sm:flex items-center px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                    CTRL K
                </div>
            </button>

            <Tooltip 
                isVisible={showTooltip} 
                text="Press Ctrl+K to search" 
                position="bottom" 
            />
        </motion.div>
    );
};

export default SearchButton;