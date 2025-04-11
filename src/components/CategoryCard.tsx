interface CategoryCardProps {
    name: string;
    image: string;
};

const CategoryCard: React.FC<CategoryCardProps> = ({ name, image }) => {
    return (
        <div className="relative rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] group">
            <img
                className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
                src={image}
                alt={name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-4 left-4">
                <div className="bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md">
                    <span className="text-gray-900 dark:text-gray-100 text-sm font-semibold">
                        {name}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;