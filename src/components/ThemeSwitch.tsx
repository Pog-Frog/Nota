import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/themeProvider";

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <>
      <div
        className={`flex items-center cursor-pointer transition-transform duration-500
            ${isDark ? "transform rotate-180" : "rotate-0"}`}
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        {isDark ? (
          <Sun className="w-8 h-8 text-yellow-500 transition-all rotate-0" />
        ) : (
          <Moon className="w-8 h-8 text-gray-600 transition-all rotate-0" />
        )}
      </div>
    </>
  );
}

export default ThemeSwitch;