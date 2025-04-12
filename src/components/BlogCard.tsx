const BlogCard = () => {
    return (
        <div className="flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] bg-white dark:bg-black border border-gray-200/30 dark:border-gray-700/30 h-full group">
            <div className="relative w-full h-56 overflow-hidden hover:cursor-pointer">
                <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src="https://placehold.co/392x220"
                    alt="Blog post thumbnail"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    <div className="px-3 py-1.5 bg-amber-500/90 backdrop-blur-sm rounded-md shadow-md transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-white text-xs font-medium">Tech</span>
                    </div>
                    <div className="px-3 py-1.5 bg-emerald-500/90 backdrop-blur-sm rounded-md shadow-md transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                        <span className="text-white text-xs font-medium">Inspiration</span>
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col gap-4 flex-grow">
                <h3 className="text-xl font-bold text-start text-gray-900 dark:text-white leading-relaxed group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 hover:cursor-pointer">
                    You need to be building business apps with adaptive design
                </h3>

                <p className="text-gray-600 text-start dark:text-gray-300 text-base line-clamp-3 flex-grow">
                    Build software for your team that works on mobile without creating a mountain of extra work for yourself
                </p>

                <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full my-1"></div>

                <div className="flex items-center mt-auto select-none">
                    <div className="flex-shrink-0">
                        <img
                            className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-700"
                            src="https://placehold.co/32x32"
                            alt="Author avatar"
                        />
                    </div>
                    <div className="ml-3 flex items-center text-sm">
                        <span className="font-semibold text-gray-900 dark:text-gray-200">Tristan L'Abbé</span>
                        <span className="mx-2 text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-gray-500 dark:text-gray-400">15 Nov 2023</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;