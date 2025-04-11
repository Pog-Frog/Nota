import CategorySection from "../components/CategorySection";
import HeroSection from "../components/HeroSection";
import RecentBlogsSection from "../components/RecentBlogsSection";
import Divider from "../components/ui/Divider";

const HomePage = () => {
    return (
        <div className="w-full relative overflow-hidden">
            <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-blue-500/20 dark:bg-blue-400/20 blur-3xl"></div>
            <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full bg-rose-500/20 dark:bg-rose-400/20 blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 relative">
                <HeroSection />

                <Divider />

                <CategorySection />

                <RecentBlogsSection />
            </div>
        </div>
    );
};

export default HomePage;