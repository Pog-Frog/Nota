import { FaBook } from "react-icons/fa";
import { Link, NavLink } from "react-router";
import { Spin as Hamburger } from "hamburger-react";
import { useEffect, useState } from "react";
import ThemeSwitch from "../components/ThemeSwitch";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

const Header = () => {
    const headerLinks = [
        {
            text: "Home",
            link: "/"
        },
        {
            text: "Blogs",
            link: "/blogs"
        }
    ];

    const [menuOpen, setMenuOpen] = useState(false);
    const [shrinkHeader, setShrinkHeader] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                setShrinkHeader(true);
            } else {
                setShrinkHeader(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
            if (e.key === 'Escape' && searchOpen) {
                setSearchOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [searchOpen]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: Implement search functionality here
        console.log("Search:", searchQuery);
        setSearchQuery("");
        setSearchOpen(false);
    };

    const logoVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.3 }
        }
    };

    const navItemVariants = {
        hover: {
            y: -2,
            color: "#818cf8", // indigo-400
            transition: { duration: 0.2 }
        }
    };

    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.5 }
        },
        open: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const mobileNavItemVariants = {
        closed: { opacity: 0, y: -20 },
        open: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    const searchButtonVariants = {
        hover: {
            scale: 1.1,
            transition: { type: "spring", stiffness: 400, damping: 10 }
        },
        tap: {
            scale: 0.95
        }
    };

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

    return (
        <>
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`sticky top-0 left-0 right-0 z-50 w-full px-4 py-2 md:py-6 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 transition-all duration-300
                    ${shrinkHeader ? "md:!py-4 shadow-lg backdrop-blur-md" : ""}
                    bg-white/90 dark:bg-black/70 border-b border-gray-200 dark:border-gray-800`}
            >
                <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between">
                    <motion.div
                        variants={logoVariants}
                        whileHover="hover"
                    >
                        <Link
                            to="/"
                            className="z-50 flex shrink-0 items-center gap-2"
                            onClick={() => setMenuOpen(false)}
                        >
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <FaBook className="text-indigo-500 dark:text-indigo-400 text-2xl md:text-3xl" />
                            </motion.div>
                            <span className="text-2xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent md:text-3xl">
                                NOTA
                            </span>
                        </Link>
                    </motion.div>

                    <nav className="hidden lg:block">
                        <ul className="flex gap-6 xl:gap-8 items-center">
                            {headerLinks.map((link) => (
                                <motion.li key={link.text} variants={navItemVariants} whileHover="hover">
                                    <NavLink
                                        to={link.link}
                                        className={({ isActive }) =>
                                            `text-lg font-semibold transition-colors
                                            text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400
                                            ${isActive ? "border-b-2 border-indigo-500 dark:border-indigo-400" : ""}`
                                        }
                                    >
                                        {link.text}
                                    </NavLink>
                                </motion.li>
                            ))}

                            {/* Search Button */}
                            <motion.div
                                className="relative ml-2"
                                variants={searchButtonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                            >
                                <motion.div
                                    className="relative ml-2"
                                    variants={searchButtonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                >
                                    <button
                                        onClick={() => setSearchOpen(true)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <Search size={18} />
                                        <span className="text-sm">Search</span>
                                        <div className="hidden sm:flex items-center px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                                            CTRL K
                                        </div>
                                    </button>

                                    {/* Tooltip */}
                                    <AnimatePresence>
                                        {showTooltip && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded shadow-lg whitespace-nowrap z-10"
                                            >
                                                Press Ctrl+K to search
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-800 dark:border-b-gray-700"></div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="ml-2"
                            >
                                <ThemeSwitch />
                            </motion.div>
                        </ul>
                    </nav>

                    {/* Mobile Menu Controls */}
                    <div className="flex items-center gap-4 z-50 lg:hidden">
                        {/* Mobile Search Button */}
                        <motion.button
                            variants={searchButtonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSearchOpen(true)}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                            <Search size={20} />
                        </motion.button>

                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <ThemeSwitch />
                        </motion.div>
                        <Hamburger
                            toggled={menuOpen}
                            toggle={toggleMenu}
                            size={24}
                            color={menuOpen ? "#818cf8" : "#64748b"}
                            label="Menu Toggle"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Mobile Menu */}
            <motion.div
                className={`fixed inset-0 z-40 bg-white dark:bg-black lg:hidden overflow-hidden ${menuOpen ? "block" : "hidden"}`}
                initial="closed"
                animate={menuOpen ? "open" : "closed"}
                variants={mobileMenuVariants}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    overflowY: 'auto'
                }}
            >
                <div className="flex h-full flex-col items-center justify-center gap-10 pt-20">
                    <motion.ul className="flex flex-col items-center gap-8">
                        {headerLinks.map((link) => (
                            <motion.li
                                key={link.text}
                                variants={mobileNavItemVariants}
                                whileHover={{ scale: 1.05, x: 5 }}
                            >
                                <NavLink
                                    to={link.link}
                                    onClick={() => setMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `text-3xl font-semibold text-gray-800 dark:text-gray-200 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 
                                        ${isActive ? "border-b-2 border-indigo-500 dark:border-indigo-400" : ""}`
                                    }
                                >
                                    {link.text}
                                </NavLink>
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>
            </motion.div>

            {/* Search Modal */}
            <AnimatePresence>
                {searchOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            onClick={() => setSearchOpen(false)}
                        />
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
                                                onClick={() => setSearchOpen(false)}
                                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <X size={18} className="text-gray-500 dark:text-gray-400" />
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="p-4 max-h-80 overflow-y-auto">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                                        Start typing to search...
                                    </div>
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
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;