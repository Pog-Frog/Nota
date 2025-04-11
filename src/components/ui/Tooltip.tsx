import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
    isVisible: boolean;
    text: string;
    position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({ isVisible, text, position = "bottom" }) => {
    const positionStyles = {
        bottom: "left-1/2 -translate-x-1/2 top-full mt-2",
        top: "left-1/2 -translate-x-1/2 bottom-full mb-2",
        left: "right-full mr-2 top-1/2 -translate-y-1/2",
        right: "left-full ml-2 top-1/2 -translate-y-1/2"
    };

    const arrowStyles = {
        bottom: "absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-800 dark:border-b-gray-700",
        top: "absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800 dark:border-t-gray-700",
        left: "absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-gray-800 dark:border-l-gray-700",
        right: "absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-800 dark:border-r-gray-700"
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute ${positionStyles[position]} px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded shadow-lg whitespace-nowrap z-10`}
                >
                    {text}
                    <div className={arrowStyles[position]}></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Tooltip;