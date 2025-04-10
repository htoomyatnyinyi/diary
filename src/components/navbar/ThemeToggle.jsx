import { useEffect, useState } from "react";
import { AiFillSun, AiFillMoon } from "react-icons/ai";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage or system preference on initial load
    if (localStorage.theme) return localStorage.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    // Apply the theme to the document
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button onClick={toggleTheme} className="p-2 text-xl m-1">
      {theme === "light" ? (
        // <div className="p-2 dark:bg-white dark:text-cyan-900 bg-cyan-900 text-white ">
        //   <AiFillMoon />
        //   {/* <p className="text-sm"> Dark</p> */}
        // </div>
        <div className="p-2 dark:border-white border-cyan-900 border-b-2 border-l-2">
          <AiFillMoon />
        </div>
      ) : (
        <div className="p-2 dark:border-white border-cyan-900 border-t-2 border-r-2">
          <AiFillSun />
        </div>
        // <div className="p-2 dark:bg-white dark:text-cyan-900 bg-cyan-900 text-white ">
        //   <AiFillSun />
        //   {/* <p className="text-sm"> Light</p> */}
        // </div>
      )}
    </button>
  );
};

export default ThemeToggle;
