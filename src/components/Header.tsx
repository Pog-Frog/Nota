import { FaBook } from "react-icons/fa";
import { Link, NavLink } from "react-router";
import { Spin as Hamburger } from "hamburger-react";
import { useEffect, useState } from "react";
import ThemeSwitch from "./ThemeSwitch";
import { motion } from "framer-motion";

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

    useEffect(() => {
        const handleScroll = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                setShrinkHeader(true);
            } else {
                setShrinkHeader(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
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
        </>
    );
};

export default Header;