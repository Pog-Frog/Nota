import FilterButton from "./FilterButton";


const RecentBlogsSection = () => {
    const categories = ["Learn", "Tools", "Tech", "Operations", "Inspiration", "News"];

    return (
        <div className="mt-16">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 dark:text-white">
                    Recent Blogs
                </h2>

                <div className="flex flex-wrap md:flex-nowrap gap-2 pb-2 w-full lg:w-auto">
                    {categories.map((category) => (
                        <FilterButton key={category} label={category} onClick={() => {}} isActive={false} />
                    ))}
                </div>
            </div>

            {/* TODO: Add articles here */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
                Blogs here
            </div>
        </div>
    );
};

export default RecentBlogsSection;