import { Outlet } from "react-router";
import Header from "./Header";

const RootLayout = () => {
    return (
        <>
            <div className="fixed hidden dark:block dotted-background h-full top-0 left-0 right-0 z-0">
                <div className="absolute left-0 right-0 bottom-0">
                </div>
            </div>
            <div className="flex flex-col min-h-screen">
                <Header showSearch={false} />
                <div className="flex flex-col">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default RootLayout;