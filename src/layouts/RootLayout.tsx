import { Outlet } from "react-router";
import Header from "../components/Header";

const RootLayout = () => {
    return (
        <>
            <div className="flex flex-col min-h-screen dark:bg-black">
                <Header />
                <div className="flex flex-col">
                    <Outlet />
                </div>
                {/* TODO: Footer */}
            </div>
        </>
    );
}

export default RootLayout;