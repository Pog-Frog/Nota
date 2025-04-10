import ThemeSwitch from "../components/ThemeSwitch";

const HomePage = () => {
    return ( 
        <div className="dark:text-white text-yellow-500">
            <ThemeSwitch />
            <h1>Home page</h1>
        </div>
     );
}
 
export default HomePage;