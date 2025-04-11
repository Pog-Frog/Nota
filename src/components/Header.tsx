import { FaBook } from "react-icons/fa";
import { Link, NavLink } from "react-router";
import { Spin as Hamburger } from "hamburger-react";
import { useEffect, useState } from "react";
import ThemeSwitch from "./ThemeSwitch";


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
    ]

    const [menuOpen, setMenuOpen] = useState(false);
    const [shrinkHeader, setShrinkHeader] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                setShrinkHeader("md:!py-4 bg-opacity-100 backdrop-blur-sm shadow-lg");
            } else {
                setShrinkHeader("");
            }
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    return (
        <>
            <div
                className={`sticky top-0 left-0 right-0 z-50 w-full px-4 py-2 md:py-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-opacity-0 transition-all duration-300 ${shrinkHeader}`}>
                <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between">
                    <Link
                        to="/"
                        className="z-50 flex shrink-0 items-center gap-2"
                        onClick={() => setMenuOpen(false)}
                    >
                        <FaBook className="text-indigo-500 text-2xl md:text-3xl" />
                        <span className="text-2xl font-medium text-white md:text-3xl">
                            NOTA
                        </span>
                    </Link>
                    <nav className="hidden lg:block">
                        <ul className="flex gap-6 xl:gap-8">
                            {headerLinks.map((link) => (
                                <li key={link.text}>
                                    <NavLink
                                        to={link.link}
                                        className={({ isActive }) =>
                                            `text-xl font-semibold text-white transition-colors hover:text-indigo-400 ${isActive ? "border-b-2 border-indigo-500" : ""}`
                                        }
                                    >
                                        {link.text}
                                    </NavLink>
                                </li>
                            ))}
                            <ThemeSwitch />
                        </ul>
                    </nav>
                    {/* Mobile Menu Button */}
                    <div className="z-50 lg:hidden">
                        <Hamburger
                            toggled={menuOpen}
                            toggle={toggleMenu}
                            size={24}
                            color="white"
                            label="Menu Toggle"
                        />
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black lg:hidden overflow-hidden"
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
                        <ul className="flex flex-col items-center gap-8">
                            {headerLinks.map((link) => (
                                <li key={link.text}>
                                    <NavLink
                                        to={link.link}
                                        onClick={() => setMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `text-3xl font-semibold text-white transition-colors hover:text-indigo-400 ${isActive ? "border-b-2 border-indigo-500" : ""}`
                                        }
                                    >
                                        {link.text}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;