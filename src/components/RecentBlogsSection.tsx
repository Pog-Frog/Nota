import BlogCard from "./BlogCard";
import FilterButton from "./FilterButton";

const RecentBlogsSection = () => {
    const categories = ["Learn", "Tools", "Tech", "Operations", "Inspiration", "News"];

    return (
        <div className="mt-16 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                <div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white relative inline-block">
                        Recent Blogs
                        <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-lg">
                        Your daily dose of diverse thinking. What topic shall we explore together?
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 py-2 w-full lg:w-auto overflow-x-auto lg:overflow-visible scrollbar-hide">
                    <div className="flex gap-2 pb-1">
                        {categories.map((category, index) => (
                            <FilterButton
                                key={category}
                                label={category}
                                onClick={() => { }}
                                isActive={index === 0}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            {/* TODO: Add articles here */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
            </div>

            <div className="flex justify-center mt-12">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:cursor-pointer">
                    Load More Articles
                </button>
            </div>
        </div>
    );
};

export default RecentBlogsSection;