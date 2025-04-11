import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/themeProvider";
import { motion } from "framer-motion";

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className="relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-800"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      ></motion.div>
      
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 360 : 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 10 
        }}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="relative z-10"
      >
        {isDark ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-6 h-6 text-indigo-300" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-6 h-6 text-amber-500" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default ThemeSwitch;