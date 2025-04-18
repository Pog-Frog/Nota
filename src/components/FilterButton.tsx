interface FilterButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, isActive, onClick }) => {
    return (
        <button
            className={`px-4 py-2 h-auto min-w-fit whitespace-nowrap bg-slate-200/30 dark:bg-slate-50/10 rounded-full text-gray-800 dark:text-white text-sm font-semibold transform hover:scale-105 transition-all duration-200 ease-in-out hover:cursor-pointer hover:dark:bg-slate-50/20 hover:bg-slate-200/50 ${isActive ? "bg-slate-300 dark:bg-slate-50/30" : ""
                }`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default FilterButton;