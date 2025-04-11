interface FilterButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, isActive, onClick }) => {
    return (
        <button 
            className={`px-4 h-9 bg-slate-200/30 dark:bg-slate-50/10 rounded-full text-gray-800 dark:text-white text-sm font-semibold hover:scale-110 transition-transform duration-200 ease-in-out hover:cursor-pointer hover:dark:bg-slate-50/20 hover:bg-slate-200/50 ${
                isActive ? "bg-slate-300 dark:bg-slate-50/30" : ""
            }`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default FilterButton;