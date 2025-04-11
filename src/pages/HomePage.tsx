import { Link } from "react-router";

const HomePage = () => {
    return (
        <div className="w-full relative overflow-hidden">

            <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-blue-500/20 dark:bg-blue-400/20 blur-3xl"></div>
            <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full bg-rose-500/20 dark:bg-rose-400/20 blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 relative">
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
                        Discover actionable insights, proven strategies, and innovative approaches to transform your product management process and make sense of user feedback at scale.
                    </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent my-10"></div>

                {/* Category Header */}
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Read by Category
                    </h2>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] group">
                        <img
                            className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
                            src="https://placehold.co/363x144"
                            alt="Customer feedback"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4">
                            <div className="bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md">
                                <span className="text-gray-900 dark:text-gray-100 text-sm font-semibold">
                                    Customer feedback
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] group">
                        <img
                            className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
                            src="https://placehold.co/363x144"
                            alt="Product Management"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4">
                            <div className="bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md">
                                <span className="text-gray-900 dark:text-gray-100 text-sm font-semibold">
                                    Product Management
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] group">
                        <img
                            className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
                            src="https://placehold.co/363x144"
                            alt="Roadmapping"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4">
                            <div className="bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md">
                                <span className="text-gray-900 dark:text-gray-100 text-sm font-semibold">
                                    Roadmapping
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
                        Featured Posts
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                STRATEGY
                            </span>
                            <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                                How to build a product roadmap everyone understands
                            </h3>
                            <p className="mt-3 text-gray-600 dark:text-gray-300">
                                Learn how to create a product roadmap that aligns your team and clearly communicates your product strategy.
                            </p>
                            <div className="mt-4 flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Alex Johnson</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Product Director • 5 min read</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                RESEARCH
                            </span>
                            <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                                User interviews that actually provide useful insights
                            </h3>
                            <p className="mt-3 text-gray-600 dark:text-gray-300">
                                Discover techniques for conducting user interviews that reveal actionable insights for your product development.
                            </p>
                            <div className="mt-4 flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Maria Chen</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">UX Researcher • 8 min read</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
            </div>
        </div>
    );
}

export default HomePage;