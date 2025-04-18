import { FaBook } from "react-icons/fa";
import { Link, NavLink } from "react-router";
import { Spin as Hamburger } from "hamburger-react";
import { useEffect, useState } from "react";
import ThemeSwitch from "../components/ThemeSwitch";
import { motion } from "framer-motion";
import { LogInIcon, LogOutIcon, Search } from "lucide-react";
import SearchButton from "../components/ui/SearchButton";
import SearchModal from "../components/ui/SearchModal";
import { useAuthStore } from "../store/AuthStore";
import { User } from "lucide-react"

interface HeaderProps {
    showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showSearch = true }) => {
    const headerLinks = [
        {
            text: "Home",
            link: "/"
        },
        {
            text: "Write",
            link: "/create"
        }
    ];

    const { isAuthenticated, user, logout } = useAuthStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const [shrinkHeader, setShrinkHeader] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

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

    const handleSearch = (query: string) => {
        console.log("Search query from header:", query);
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

                            {isAuthenticated ? (
                                <div className="relative group">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full border border-indigo-100 dark:border-indigo-800 text-gray-800 dark:text-gray-200 shadow-sm cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-700/60 flex items-center justify-center">
                                                <User className="text-indigo-600 dark:text-indigo-300" size={16} />
                                            </div>
                                            <span className="font-medium text-sm">
                                                {user?.displayName || 'User'}
                                            </span>
                                        </div>
                                    </motion.div>
                                    <div className="absolute right-0 mt-2 w-28 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                                        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg outline-none focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ring-opacity-5 overflow-hidden">
                                            <button
                                                onClick={() => logout()}
                                                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors duration-150 hover:cursor-pointer"
                                            >
                                                Log out
                                                <LogOutIcon className="text-gray-400 dark:text-gray-500" size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 rounded-full text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        <LogInIcon size={16} />
                                        <span>Sign In</span>
                                    </Link>
                                </motion.div>
                            )}

                            {showSearch && (
                                <SearchButton onClick={() => setSearchOpen(true)} />
                            )}

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
                        {showSearch && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSearchOpen(true)}
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            >
                                <Search size={20} />
                            </motion.button>
                        )}

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

                        {isAuthenticated ? (
                            <motion.li
                                variants={mobileNavItemVariants}
                                className="mt-8 w-full flex flex-col items-center"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="flex flex-col items-center gap-4 text-gray-800 dark:text-gray-200 w-64"
                                >
                                    <button
                                        onClick={() => logout()}
                                        className="mt-2 flex items-center justify-center gap-2 px-5 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors duration-150 shadow-sm w-full"
                                    >
                                        <span>Log out</span>
                                        <LogOutIcon size={16} />
                                    </button>
                                </motion.div>
                            </motion.li>
                        ) : (
                            <motion.li
                                variants={mobileNavItemVariants}
                                className="mt-8 w-full flex flex-col items-center"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="w-64"
                                >
                                    <Link
                                        to="/login"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 rounded-lg text-white font-medium text-lg shadow-md hover:shadow-lg transition-all duration-300 w-full"
                                    >
                                        <LogInIcon size={20} />
                                        <span>Sign In</span>
                                    </Link>
                                </motion.div>
                            </motion.li>
                        )}
                    </motion.ul>
                </div>
            </motion.div>

            <SearchModal
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
                onSearch={handleSearch}
            />
        </>
    );
};

export default Header;