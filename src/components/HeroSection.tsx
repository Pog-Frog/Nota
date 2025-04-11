import { Link } from "react-router";

const HeroSection = () => {
    return (
        <div className="mx-auto max-w-4xl text-center mb-16">
            <Link to="/">
                <button className="relative overflow-hidden rounded-md text-white px-4 py-2 hover:cursor-pointer">
                    <div className="group relative mx-auto flex items-center justify-center gap-2 rounded-2xl dark:bg-black/40 px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-sm transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">

                        <div className="absolute inset-0 z-0 h-full w-full animate-gradient bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:subtract] rounded-2xl"></div>

                        <span className="z-10 flex items-center gap-1">
                            🚀
                            <span className="animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:300%_100%] bg-clip-text text-transparent">
                                Start your journey NOW
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-chevron-right ml-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                            >
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </span>
                    </div>
                </button>
            </Link>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Crafting <span className="bg-gradient-to-tl from-indigo-600 via-purple-500 to-rose-500 bg-clip-text text-transparent">Engaging Stories</span>
            </h1>

            <p className="mt-6 text-lg leading-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                Words that linger, ideas that stick. Read, reflect, repeat.
            </p>
        </div>
    );
};

export default HeroSection;