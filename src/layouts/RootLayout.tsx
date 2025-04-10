import { Outlet } from "react-router";

const RootLayout = () => {
    return (
        <>
            <div className="flex flex-col min-h-screen dark:bg-black">
                <Outlet />
            </div>
        </>
    );
}

export default RootLayout;