import CategoryCard from "./CategoryCard";

const CategorySection = () => {
    const categories = [
        { id: 1, name: "Customer feedback", image: "https://placehold.co/363x144" },
        { id: 2, name: "Product Management", image: "https://placehold.co/363x144" },
        { id: 3, name: "Roadmapping", image: "https://placehold.co/363x144" },
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Read by Category
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <CategoryCard key={category.id} name={category.name} image={category.image} />
                ))}
            </div>
        </div>
    );
};

export default CategorySection;